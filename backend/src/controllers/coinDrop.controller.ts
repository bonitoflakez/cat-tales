import { Request, Response } from "express";
import pool from "../models/db";

interface coins {
  amount: number;
}

function getRandCoins(): number {
  return Math.floor(Math.random() * 100);
}

function checkLastClaimTime(lastClaimTime: Date): boolean {
  const now = new Date();
  const timeDiff = Math.floor(now.getTime() - lastClaimTime.getTime());
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return hoursDiff >= 24;
}

export const dropDailyCoins = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { user_id } = req.body;

    await client.query("BEGIN");

    const userQuery =
      "SELECT user_id, last_claim_time FROM players WHERE user_id = $1";
    const userValue = [user_id];
    const userResult = await client.query(userQuery, userValue);

    if (userResult.rowCount === 0 || !user_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    const userRecord = userResult.rows[0];
    const lastClaimTime = userRecord.last_claim_time;

    if (lastClaimTime && !checkLastClaimTime(lastClaimTime)) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Coins already claimed",
      });
    }

    const coins: coins = {
      amount: getRandCoins(),
    };

    const updateLastClaimTimeQuery =
      "UPDATE players SET last_claim_time = $1 WHERE user_id = $2";
    const updateLastClaimTimeValues = [new Date(), user_id];
    await client.query(updateLastClaimTimeQuery, updateLastClaimTimeValues);

    await client.query("COMMIT");

    return res.status(200).json(coins);
  } catch (err) {
    console.error("Error getting coins amount:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};
