import { Request, Response } from "express";
import { ItemType } from "../types/itemStore.types";
import { rarities } from "../constants/itemRarity";
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

import {
  getRandomRarity,
  calculatePrice,
  cacheItemData,
  getCachedItemData,
} from "../helpers/storeItem.helper";

export const getStoreItems = async (req: Request, res: Response) => {
  try {
    const getItemDetails = (items: ItemType[]) =>
      items.map((item) => {
        const cachedItemData = getCachedItemData(item.name);
        if (cachedItemData) {
          return {
            name: item.name,
            type: item.type,
            type_id: item.type_id,
            rarity: cachedItemData.rarity,
            rarity_id:
              rarities.find((r) => r.itemRarity === cachedItemData.rarity)
                ?.id || 1,
            price: cachedItemData.price,
          };
        } else {
          const rarityData = getRandomRarity();
          const price = calculatePrice(item.price, rarityData.itemRarity);
          cacheItemData(item.name, rarityData.itemRarity, price);
          return {
            name: item.name,
            type: item.type,
            type_id: item.type_id,
            rarity: rarityData.itemRarity,
            rarity_id: rarityData.id,
            price: price,
          };
        }
      });

    const storeItems: ItemType[] = [
      ...Food,
      ...Toys,
      ...Charms,
      ...Treats,
      ...Potion,
      ...Costume,
      ...GroomingSupplies,
    ];

    const storeDataWithDetails = getItemDetails(storeItems);  

    return res.status(200).json({
      storeDataWithDetails
    });
  } catch (err) {
    console.error("Error fetching store items:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const buyStoreItem = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { name, type, rarity, price, user_id } = req.body;

    await client.query("BEGIN");

    const getUserCoinsQuery = "SELECT coins FROM currency WHERE user_id = $1";
    const getUserCoinsValues = [user_id];
    const userCoinsResult = await client.query(
      getUserCoinsQuery,
      getUserCoinsValues
    );

    if (userCoinsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Invalid user" });
    }

    const userCoins = userCoinsResult.rows[0].coins;

    const remainingCoins = userCoins - price;

    if (remainingCoins < 0) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Insufficient coins to buy this item" });
    }

    const updateCoinsQuery =
      "UPDATE currency SET coins = $1 WHERE user_id = $2";
    const updateCoinsValues = [remainingCoins, user_id];
    await client.query(updateCoinsQuery, updateCoinsValues);

    const insertQuery =
      "INSERT INTO items (name, type, rarity, user_id) VALUES ($1, $2, $3, $4)";
    const insertValues = [name, type, rarity, user_id];
    await client.query(insertQuery, insertValues);

    await client.query("COMMIT");

    return res.status(201).json({ message: "Item bought successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error while grabbing drop item:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
