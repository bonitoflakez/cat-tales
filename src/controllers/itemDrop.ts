import { Request, Response } from "express";
import pool from "../models/db";
import {
  Food,
  Toys,
  Charms,
  Treats,
  Potion,
  Costume,
  GroomingSupplies,
} from "../constants/itemNameAndType";
import { rarities } from "../constants/itemRarity";

function generateItemNameAndType() {
  const allItems = [
    ...Food,
    ...Toys,
    ...Charms,
    ...Treats,
    ...Potion,
    ...Costume,
    ...GroomingSupplies,
  ];

  const randomIndex = Math.floor(Math.random() * allItems.length);
  const randomItem = allItems[randomIndex];

  return {
    name: randomItem.name,
    type: randomItem.type,
    type_id: randomItem.type_id,
  };
}

function generateItemRarity() {
  const totalWeight = rarities.reduce((sum, rarity) => sum + rarity.weight, 0);

  const randomNumber = Math.floor(Math.random() * totalWeight) + 1;

  let cumulativeWeight = 0;
  for (const rarity of rarities) {
    cumulativeWeight += rarity.weight;
    if (randomNumber <= cumulativeWeight) {
      return { item_rarity_id: rarity.id, item_rarity: rarity.itemRarity };
    }
  }

  return {
    item_rarity_id: rarities[0].id,
    item_rarity: rarities[0].itemRarity,
  };
}

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
  try {
    const { name, type, rarity, user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Invalid owner" });
    }

    let rewardXP = calculateRarityXP(10, rarity);

    const insertQuery =
      "INSERT INTO items (name, type, rarity, user_id) VALUES ($1, $2, $3, $4)";
    const values = [name, type, rarity, user_id];
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

    return res.status(201).json({ message: "Item stored in inventory" });
  } catch (err) {
    console.error("Error while grabbing drop item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
