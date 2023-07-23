import { Request, Response } from "express";
import pool from "../models/db";

function generateCatType() {
  const types = [
    { typeId: 1, type: "Common", weight: 10 },
    { typeId: 2, type: "Uncommon", weight: 10 },
    { typeId: 3, type: "Rare", weight: 8 },
    { typeId: 4, type: "Epic", weight: 5 },
    { typeId: 5, type: "Legendary", weight: 2 },
    { typeId: 6, type: "Godlike", weight: 1 },
  ];

  const totalWeight = types.reduce((sum, type) => sum + type.weight, 0);

  const randomNumber = Math.floor(Math.random() * totalWeight) + 1;

  let cumulativeWeight = 0;
  for (const type of types) {
    cumulativeWeight += type.weight;
    if (randomNumber <= cumulativeWeight) {
      return { typeId: type.typeId, type: type.type };
    }
  }

  return { typeId: types[0].typeId, type: types[0].type };
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
    const { name, type, level, ownerId } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a valid name for the cat." });
    }

    const insertQuery =
      "INSERT INTO cats (name, rarity, level, ownerId) VALUES ($1, $2, $3, $4)";
    const values = [name, type, level, ownerId];
    await pool.query(insertQuery, values);

    return res.status(201).json({ message: "Cat adopted successfully" });
  } catch (err) {
    console.error("Error adopting a cat:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
