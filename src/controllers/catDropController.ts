import { Request, Response } from "express";
import pool from "../models/db";
import { rarities } from "../constants/itemRarity";

const calculateRarityXP = (base: number, rarity: number): number => {
  switch (rarity) {
    case 1:
      return base + 0;
    case 2:
      return base + 10;
    case 3:
      return base + 20;
    case 4:
      return base + 30;
    case 5:
      return base + 40;
    case 6:
      return base + 50;
    default:
      return base;
  }
};

const calculateLevelXP = (level: number): number => {
  let convertedXP = 100 * level;
  return convertedXP;
};

function generateCatType() {
  const totalWeight = rarities.reduce((sum, rarity) => sum + rarity.weight, 0);

  const randomNumber = Math.floor(Math.random() * totalWeight) + 1;

  let cumulativeWeight = 0;
  for (const rarity of rarities) {
    cumulativeWeight += rarity.weight;
    if (randomNumber <= cumulativeWeight) {
      return { typeId: rarity.id, type: rarity.itemRarity };
    }
  }

  return { typeId: rarities[0].id, type: rarities[0].itemRarity };
}

function generateCatLevel() {
  return Math.floor(Math.random() * 10) + 1;
}

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
  try {
    const { name, type, level, user_id } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a valid name for the cat." });
    }

    let catXP = calculateLevelXP(level);
    let rewardXP = catXP + calculateRarityXP(100, type);
    let updatedLevel = Math.floor(rewardXP / 100);

    const insertQuery =
      "INSERT INTO cats (name, rarity, level, user_id, xp) VALUES ($1, $2, $3, $4, $5)";
    const values = [name, type, updatedLevel, user_id, rewardXP];
    await pool.query(insertQuery, values);

    const getCurrentPlayerXPQuery = "SELECT xp FROM players WHERE user_id = $1";
    const getCurrentPlayerXPValues = [user_id];
    const currentPlayerXPResult = await pool.query(
      getCurrentPlayerXPQuery,
      getCurrentPlayerXPValues
    );

    if (currentPlayerXPResult.rows.length === 0) {
      return res.status(404).json({ message: "Invalid player" });
    }

    const currentPlayerXP = currentPlayerXPResult.rows[0].xp;

    const newPlayerXP = currentPlayerXP + rewardXP;

    const updatePlayerXPQuery = "UPDATE players SET xp = $1 WHERE user_id = $2";
    const updatePlayerXPValues = [newPlayerXP, user_id];
    await pool.query(updatePlayerXPQuery, updatePlayerXPValues);

    return res.status(201).json({ message: "Cat adopted successfully" });
  } catch (err) {
    console.error("Error adopting a cat:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
