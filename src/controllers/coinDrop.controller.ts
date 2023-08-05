import { Request, Response } from "express";
import pool from "../models/db";

interface coins {
  amount: number;
}

function getRandCoins(): number {
  return Math.floor(Math.random() * 100);
}

export const dropDailyCoins = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const coins: coins = {
      amount: getRandCoins(),
    };

    

    return res.status(200).json(coins);
  } catch (err) {
    console.error("Error getting coins amount:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
