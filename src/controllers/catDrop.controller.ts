import { Request, Response } from "express";
import { calculateCoinReward } from "../helpers/rewardCoins.helper";
import pool from "../models/db";

import {
  generateCatType,
  generateCatLevel,
  calculateLevelXP,
  calculateRarityXP,
} from "../helpers/catDrop.helper";

export const dropRandomCat = async (req: Request, res: Response) => {
  try {
    const cat = {
      type: generateCatType(),
      level: generateCatLevel(),
    };

    return res.status(200).json(cat);
  } catch (err) {
    console.error("Error generating a random cat:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adoptCat = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { name, type, level, user_id } = req.body;

    if (!name || !type || !level || !user_id) {
      return res
        .status(400)
        .json({ message: "Something is missing in details" });
    }

    let catXP = calculateLevelXP(level);
    let rewardXP = catXP + calculateRarityXP(100, type);
    let updatedLevel = Math.floor(rewardXP / 100);

    await client.query("BEGIN");

    const insertQuery =
      "INSERT INTO cats (name, rarity, level, user_id, xp) VALUES ($1, $2, $3, $4, $5)";
    const values = [name, type, updatedLevel, user_id, rewardXP];
    await client.query(insertQuery, values);

    const getCurrentPlayerXPQuery = "SELECT xp FROM players WHERE user_id = $1";
    const getCurrentPlayerXPValues = [user_id];
    const currentPlayerXPResult = await client.query(
      getCurrentPlayerXPQuery,
      getCurrentPlayerXPValues
    );

    if (currentPlayerXPResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Invalid player" });
    }

    const currentPlayerXP = currentPlayerXPResult.rows[0].xp;

    const newPlayerLevel = Math.floor(rewardXP / 100);
    const coinReward = calculateCoinReward(newPlayerLevel);

    const newPlayerXP = currentPlayerXP + rewardXP;

    const updatePlayerXPQuery = "UPDATE players SET xp = $1 WHERE user_id = $2";
    const updatePlayerXPValues = [newPlayerXP, user_id];
    await client.query(updatePlayerXPQuery, updatePlayerXPValues);

    const getPlayerCoinQuery = "SELECT * FROM currency WHERE user_id=$1";
    const getPlayerCoinValue = [user_id];
    const playerCoins = await client.query(
      getPlayerCoinQuery,
      getPlayerCoinValue
    );

    const coins = playerCoins.rows[0];
    const rewardedCoins = coinReward + coins.coins;

    const updatePlayerCoinQuery =
      "UPDATE currency SET coins = $1 WHERE user_id = $2";
    const updatePlayerCoinValues = [rewardedCoins, user_id];
    await client.query(updatePlayerCoinQuery, updatePlayerCoinValues);

    await client.query("COMMIT");

    return res.status(201).json({ message: "Cat adopted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error adopting a cat:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
