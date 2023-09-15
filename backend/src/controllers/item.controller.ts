import { Request, Response } from "express";
import pool from "../models/db";

import {
  getTypeArray,
  handleItemXPBoost,
} from "../helpers/itemController.helper";
import {
  calculateCoinReward,
  checkLevelUp,
} from "../helpers/rewardCoins.helper";

export const getItemDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const itemQuery = "SELECT * FROM items WHERE user_id = $1";
    const itemOwnerValue = [userId];
    const itemDetailsResult = await pool.query(itemQuery, itemOwnerValue);

    if (itemDetailsResult.rowCount === 0) {
      return res.status(200).json({
        message: "This player has no itmes",
        has_items: false,
      });
    }

    const items = itemDetailsResult.rows;
    return res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching item details:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const useItem = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { itemName, type, rarity, userId, catName, catId } = req.body;
    const itemTypeNumber = parseInt(type);

    await client.query("BEGIN");

    const itemGetXPQuery =
      "SELECT * FROM items WHERE name=$1 AND type=$2 AND rarity=$3 AND user_id=$4";
    const itemGetXPValue = [itemName, itemTypeNumber, rarity, userId];
    const itemGetXPResult = await client.query(itemGetXPQuery, itemGetXPValue);

    const items = itemGetXPResult.rows[0];

    if (!items) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "No items found for this user" });
    }

    const itemTypeArray = getTypeArray(itemTypeNumber);
    const itemData = itemTypeArray.find(
      (item) => item.name === itemName && item.type_id === itemTypeNumber
    );

    if (!itemData) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "Item not found in the database" });
    }

    let incXP = handleItemXPBoost(itemData.xp, rarity);

    const getCatDataQuery = "SELECT * FROM cats WHERE name=$1 AND id=$2";
    const getCatDataValue = [catName, catId];
    const getCatDataResult = await client.query(
      getCatDataQuery,
      getCatDataValue
    );

    const cat = getCatDataResult.rows[0];

    if (!cat) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Unable to find cat name" });
    }

    const updatedCatXP = cat.xp + incXP;

    const updatedCatLevel = Math.floor(updatedCatXP / 100);

    const updateCatQuery =
      "UPDATE cats SET xp=$1, level=$2 WHERE name=$3 AND id=$4";
    const updateCatValues = [updatedCatXP, updatedCatLevel, catName, catId];
    await client.query(updateCatQuery, updateCatValues);

    const getPlayerXPQuery = "SELECT * FROM players WHERE user_id=$1";
    const getPlayerXPValue = [userId];
    const getPlayerXPResult = await client.query(
      getPlayerXPQuery,
      getPlayerXPValue
    );

    const player = getPlayerXPResult.rows[0];
    const currentLVL = Math.floor(player.xp / 100);
    const updatedPlayerXP = player.xp + Math.floor(incXP * 2);
    const newLVL = Math.floor(updatedPlayerXP / 100);

    let levelUpRewardCoins = 0;

    if (player.xp < updatedPlayerXP && checkLevelUp(currentLVL, newLVL)) {
      levelUpRewardCoins = calculateCoinReward(newLVL);
    }

    const updatePlayerXPQuery = "UPDATE players SET xp=$1 WHERE user_id=$2";
    const updatePlayerXPValue = [updatedPlayerXP, userId];
    await client.query(updatePlayerXPQuery, updatePlayerXPValue);

    const getPlayerCoinQuery = "SELECT * FROM currency WHERE user_id=$1";
    const getPlayerCoinValue = [userId];
    const playerCoins = await client.query(
      getPlayerCoinQuery,
      getPlayerCoinValue
    );

    const coins = playerCoins.rows[0];
    const rewardedCoins = levelUpRewardCoins + coins.coins;

    const updatePlayerCoinQuery =
      "UPDATE currency SET coins=$1 WHERE user_id=$2";
    const updatePlayerCoinValue = [rewardedCoins, userId];
    await client.query(updatePlayerCoinQuery, updatePlayerCoinValue);

    // using `LIMIT 1` to delete only one item if there are multiple items with same name, type, and rarity
    const deleteUsedItemQuery = `
      DELETE FROM items
      WHERE id IN (
        SELECT id
        FROM items
        WHERE name=$1 AND type=$2 AND rarity=$3
        LIMIT 1
      )`;
    const deleteUsedItemValue = [itemName, type, rarity];
    await client.query(deleteUsedItemQuery, deleteUsedItemValue);

    await client.query("COMMIT");

    const result = {
      item_name: itemData.name,
      itemRarity: rarity,
      catXP: updatedCatXP,
      catlvl: updatedCatLevel,
      playerXP: updatedPlayerXP,
      levelup: checkLevelUp(currentLVL, newLVL),
      rewardCoins: levelUpRewardCoins,
    };

    return res.status(200).json(result);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error using item:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
