import { Request, Response } from "express";
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

// TODO: Do something about multiple items with same name, type and rarity

function getTypeArray(type: number) {
  switch (type) {
    case 1:
      return Food;
    case 2:
      return Toys;
    case 3:
      return Charms;
    case 4:
      return Treats;
    case 5:
      return Potion;
    case 6:
      return Costume;
    case 7:
      return GroomingSupplies;
    default:
      return [];
  }
}

function handleItemXPBoost(base: number, rarity: number) {
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
}

export const getItemDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const itemQuery = "SELECT * FROM items WHERE user_id = $1";
    const itemOwnerValue = [userId];
    const itemDetailsResult = await pool.query(itemQuery, itemOwnerValue);

    if (itemDetailsResult.rowCount === 0) {
      return res.status(404).json({ message: "This owner has no items!!??" });
    }

    const items = itemDetailsResult.rows;
    return res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching item details:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const useItem = async (req: Request, res: Response) => {
  try {
    const { itemName, type, rarity, userId, catName } = req.body;
    const itemTypeNumber = parseInt(type);
    const itemGetXPQuery =
      "SELECT * FROM items WHERE name=$1 AND type=$2 AND rarity=$3 AND user_id=$4";
    const itemGetXPValue = [itemName, itemTypeNumber, rarity, userId];
    const itemGetXPResult = await pool.query(itemGetXPQuery, itemGetXPValue);

    const items = itemGetXPResult.rows;

    if (!items) {
      return res.status(404).json({ message: "No items found for this user" });
    }

    const itemTypeArray = getTypeArray(itemTypeNumber);
    const itemData = itemTypeArray.find(
      (item) => item.name === itemName && item.type_id === itemTypeNumber
    );

    if (!itemData) {
      return res
        .status(404)
        .json({ message: "Item not found in the database" });
    }

    let incXP = handleItemXPBoost(itemData.xp, rarity);

    const getCatDataQuery = "SELECT * FROM cats WHERE name=$1";
    const getCatDataValue = [catName];
    const getCatDataResult = await pool.query(getCatDataQuery, getCatDataValue);

    const cat = getCatDataResult.rows[0];

    if (!cat) {
      return res.status(404).json({ message: "Unable to find cat name" });
    }

    const updatedCatXP = cat.xp + incXP;

    const updatedCatLevel = Math.floor(updatedCatXP / 100);

    const updateCatQuery = "UPDATE cats SET xp=$1, level=$2 WHERE name=$3";
    const updateCatValues = [updatedCatXP, updatedCatLevel, catName];
    await pool.query(updateCatQuery, updateCatValues);

    const getPlayerXPQuery = "SELECT * FROM players WHERE user_id=$1";
    const getPlayerXPValue = [userId];
    const getPlayerXPResult = await pool.query(
      getPlayerXPQuery,
      getPlayerXPValue
    );

    const player = getPlayerXPResult.rows[0];
    const updatedPlayerXP = player.xp + Math.floor(incXP * 2);

    const updatePlayerXPQuery = "UPDATE players SET xp=$1 WHERE user_id=$2";
    const updatePlayerXPValue = [updatedPlayerXP, userId];
    await pool.query(updatePlayerXPQuery, updatePlayerXPValue);

    const result = {
      item_name: itemData.name,
      itemRarity: rarity,
      catXP: updatedCatXP,
      catlvl: updatedCatLevel,
      playerXP: updatedPlayerXP,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error using item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
