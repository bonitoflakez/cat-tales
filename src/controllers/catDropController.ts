import { Request, Response } from "express";
import pool from "../models/db";
import { rarities } from "../constants/itemRarity";

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

const calculateRarityXP = (base: number, rarity: number): number => {
  if (rarity === 1) {
    return base + 0;
  } else if (rarity === 2) {
    return base + 10;
  } else if (rarity === 3) {
    return base + 20;
  } else if (rarity === 4) {
    return base + 30;
  } else if (rarity === 5) {
    return base + 40;
  } else if (rarity === 5) {
    return base + 50;
  } else {
    return base;
  }
};

const calculateLevelXP = (level: number): number => {
  let convertedXP = 10 * level;
  return convertedXP;
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
    let playerXP = catXP + calculateRarityXP(10, type);

    const insertQuery =
      "INSERT INTO cats (name, rarity, level, user_id, xp) VALUES ($1, $2, $3, $4, $5)";
    const values = [name, type, level, user_id, catXP];
    await pool.query(insertQuery, values);

    const updatePlayerXPQuery = "UPDATE players SET xp = $1 WHERE user_id = $2";
    const updatePlayerXPValues = [playerXP, user_id];
    await pool.query(updatePlayerXPQuery, updatePlayerXPValues);

    return res.status(201).json({ message: "Cat adopted successfully" });
  } catch (err) {
    console.error("Error adopting a cat:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
