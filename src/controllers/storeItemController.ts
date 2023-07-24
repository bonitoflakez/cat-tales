import { Request, Response } from "express";
import { rarities } from "../constants/itemRarity";
import {
  Food,
  Toys,
  Charms,
  Treats,
  Potion,
  Costume,
  GroomingSupplies,
} from "../constants/itemNameAndType";
import pool from "../models/db";

/**
 * todo: keep the rarity and price of items same for 24 hours and re-run the `getRandomRarity` function after that
 * todo: find a better way to increment price of items based on their rarity
 */

type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Godlike";

interface StoreItem {
  name: string;
  type: string;
  type_id: number;
  rarity: Rarity;
  rarity_id: number;
  price: number;
}

const getRandomRarity = (): { id: number; itemRarity: Rarity } => {
  const totalWeight = rarities.reduce((sum, rarity) => sum + rarity.weight, 0);
  let randomNum = Math.random() * totalWeight;

  for (const rarity of rarities) {
    if (randomNum < rarity.weight) {
      return { id: rarity.id, itemRarity: rarity.itemRarity as Rarity };
    }
    randomNum -= rarity.weight;
  }

  return { id: 1, itemRarity: "Common" };
};

type ItemType =
  | (typeof Food)[number]
  | (typeof Toys)[number]
  | (typeof Charms)[number]
  | (typeof Treats)[number]
  | (typeof Potion)[number]
  | (typeof Costume)[number]
  | (typeof GroomingSupplies)[number];

export const getStoreItems = async (req: Request, res: Response) => {
  try {
    const getItemDetails = (items: ItemType[]) =>
      items.map((item) => {
        const rarityData = getRandomRarity();
        return {
          name: item.name,
          type: item.type,
          type_id: item.type_id,
          rarity: rarityData.itemRarity,
          rarity_id: rarityData.id,
          price: calculatePrice(item.price, rarityData.itemRarity),
        };
      });

    const calculatePrice = (basePrice: number, rarity: Rarity): number => {
      if (rarity === "Common") {
        return basePrice + 0;
      } else if (rarity === "Uncommon") {
        return basePrice + 10;
      } else if (rarity === "Rare") {
        return basePrice + 20;
      } else if (rarity === "Epic") {
        return basePrice + 30;
      } else if (rarity === "Legendary") {
        return basePrice + 40;
      } else if (rarity === "Godlike") {
        return basePrice + 50;
      } else {
        return basePrice;
      }
    };

    const storeItems: ItemType[] = [
      ...Food,
      ...Toys,
      ...Charms,
      ...Treats,
      ...Potion,
      ...Costume,
      ...GroomingSupplies,
    ];

    const itemNamesWithDetails = getItemDetails(storeItems);

    return res.status(200).json({
      itemNames: itemNamesWithDetails,
    });
  } catch (err) {
    console.error("Error fetching store items:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const buyStoreItem = async (req: Request, res: Response) => {
  try {
    const { name, type, rarity, price, user_id } = req.body;

    const getUserCoinsQuery = "SELECT coins FROM currency WHERE user_id = $1";
    const getUserCoinsValues = [user_id];
    const userCoinsResult = await pool.query(
      getUserCoinsQuery,
      getUserCoinsValues
    );

    if (userCoinsResult.rows.length === 0) {
      return res.status(404).json({ message: "Invalid user" });
    }

    const userCoins = userCoinsResult.rows[0].coins;

    const remainingCoins = userCoins - price;

    if (remainingCoins < 0) {
      return res
        .status(400)
        .json({ message: "Insufficient coins to buy this item" });
    }

    const updateCoinsQuery =
      "UPDATE currency SET coins = $1 WHERE user_id = $2";
    const updateCoinsValues = [remainingCoins, user_id];
    await pool.query(updateCoinsQuery, updateCoinsValues);

    const insertQuery =
      "INSERT INTO items (name, type, rarity, user_id) VALUES ($1, $2, $3, $4)";
    const insertValues = [name, type, rarity, user_id];
    await pool.query(insertQuery, insertValues);

    return res.status(201).json({ message: "Item bought successfully" });
  } catch (err) {
    console.error("Error while grabbing drop item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
