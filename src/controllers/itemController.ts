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
  /**
   *** fetch item data from the database using name, type, rarity, and user_id
   ** if the item exists in the TypeScript arrays, return its XP
   ** process the XP based on rarity of item owned by user
   ** apply the XP on cat
   ** increase XP of user
   */

  try {
    const { name, type, rarity, user_id } = req.body;
    const itemGetXPQuery =
      "SELECT * FROM items WHERE name=$1 AND type=$2 AND rarity=$3 AND user_id=$4";
    const itemGetXPValue = [name, type, rarity, user_id];
    const itemGetXPResult = await pool.query(itemGetXPQuery, itemGetXPValue);

    const items = itemGetXPResult.rows;

    const itemTypeArray = getTypeArray(type);
    // issue: only returning first item and the matching one
    const itemRes = itemTypeArray.find((item) => item.name === name); // this should find item name from constants and get the xp of that item

    const itemResponse = {
      exists: items.length > 0 ? true : false,
      amount: items.length,
      type_res: itemTypeArray,
      itemRes: itemRes,
    };

    if (itemResponse.exists) {
      return res.status(200).json(itemResponse);

      // if (item) {
      //   return res.status(200).json({
      //     ...itemResponse,
      //     xp: item.xp,
      //   });
      // }
    }
  } catch (err) {
    console.error("Error using item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * TODO: Get items owned by user
 * TODO: Each item will possess some XP based on item's rarity and type
 * TODO: Item's XP will increase if both cat and item has the same rarity or above
 * TODO: Both cat and item's XP effect will not be affected if cat is of higher rarity and item is of lower rarity
 *
 * TODO: Do something about multiple items with same name, type and rarity
 */
