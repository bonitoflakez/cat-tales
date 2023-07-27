import { Request, Response } from "express";
import pool from "../models/db";

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

    if (!user_id) {
      return res.status(400).json({ message: "Invalid player" });
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

    const updatePlayerXPQuery = "UPDATE players SET xp = $1 WHERE user_id = $2";
    const updatePlayerXPValues = [newPlayerXP, user_id];
    await client.query(updatePlayerXPQuery, updatePlayerXPValues);

    await client.query("COMMIT");

    return res.status(201).json({ message: "Item stored in inventory" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error while grabbing drop item:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
