import { Request, Response } from "express";
import pool from "../models/db";

import {
  calculateCoinReward,
  checkLevelUp,
} from "../helpers/rewardCoins.helper";

import {
  generateItemNameAndType,
  generateItemRarity,
  calculateRarityXP,
} from "../helpers/itemDrop.helper";

export const dropRandomItem = async (req: Request, res: Response) => {
  try {
    const item = {
      type: generateItemNameAndType(),
      rarity: generateItemRarity(),
    };

    return res.status(200).json(item);
  } catch (err) {
    console.error("Error generating item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addDropItemToInventory = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { name, type, rarity, user_id } = req.body;

    const userQuery = "SELECT user_id FROM players WHERE user_id = $1";
    const userValue = [user_id];
    const userResult = await client.query(userQuery, userValue);

    if (userResult.rowCount === 0 || !user_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    let rewardXP = calculateRarityXP(10, rarity);

    await client.query("BEGIN");

    const insertQuery =
      "INSERT INTO items (name, type, rarity, user_id) VALUES ($1, $2, $3, $4)";
    const values = [name, type, rarity, user_id];
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

    const newPlayerXP = currentPlayerXP + rewardXP;

    const getPlayerXPQuery = "SELECT * FROM players WHERE user_id=$1";
    const getPlayerXPValue = [user_id];
    const getPlayerXPResult = await client.query(
      getPlayerXPQuery,
      getPlayerXPValue
    );

    const player = getPlayerXPResult.rows[0];
    const currentLVL = Math.floor(player.xp / 100);
    const updatedPlayerXP = player.xp + Math.floor(newPlayerXP * 2);
    const newLVL = Math.floor(updatedPlayerXP / 100);

    let levelUpRewardCoins = 0;

    if (player.xp < updatedPlayerXP && checkLevelUp(currentLVL, newLVL)) {
      levelUpRewardCoins = calculateCoinReward(newLVL);
    }

    const getPlayerCoinQuery = "SELECT * FROM currency WHERE user_id=$1";
    const getPlayerCoinValue = [user_id];
    const playerCoins = await client.query(
      getPlayerCoinQuery,
      getPlayerCoinValue
    );

    const coins = playerCoins.rows[0];
    const rewardedCoins = levelUpRewardCoins + coins.coins;

    const updatePlayerCoinQuery =
      "UPDATE currency SET coins=$1 WHERE user_id=$2";
    const updatePlayerCoinValue = [rewardedCoins, user_id];
    await client.query(updatePlayerCoinQuery, updatePlayerCoinValue);

    const updatePlayerXPQuery = "UPDATE players SET xp = $1 WHERE user_id = $2";
    const updatePlayerXPValues = [newPlayerXP, user_id];
    await client.query(updatePlayerXPQuery, updatePlayerXPValues);

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Item stored in inventory",
      levelup: checkLevelUp(currentLVL, newLVL),
      rewardCoins: levelUpRewardCoins,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error while grabbing drop item:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
