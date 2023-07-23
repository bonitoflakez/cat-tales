import { Request, Response } from "express";
import pool from "../models/db";

function generateItemNameAndType() {
  const Food = [
    { name: "Tasty Tuna Treats", category: "Food", type_id: 1 },
    { name: "Crunchy Chicken Bites", category: "Food", type_id: 1 },
    { name: "Savory Salmon Delight", category: "Food", type_id: 1 },
    { name: "Delicious Duck Jerky", category: "Food", type_id: 1 },
    { name: "Yummy Yogurt Drops", category: "Food", type_id: 1 },
  ];

  const Toys = [
    { name: "Feather Teaser Wand", category: "Toys", type_id: 2 },
    { name: "Catnip Mouse Toy", category: "Toys", type_id: 2 },
    { name: "Interactive Laser Pointer", category: "Toys", type_id: 2 },
    { name: "Sisal Ball Chaser", category: "Toys", type_id: 2 },
    { name: "Crinkly Tunnel Toy", category: "Toys", type_id: 2 },
  ];

  const Charms = [
    { name: "Lucky Cat Charm", category: "Charm", type_id: 3 },
    { name: "Enchanted Amulet", category: "Charm", type_id: 3 },
    { name: "Sparkling Crystal Pendant", category: "Charm", type_id: 3 },
    { name: "Ancient Symbol of Fortune", category: "Charm", type_id: 3 },
    { name: "Moonlit Magic Charm", category: "Charm", type_id: 3 },
  ];

  const Treats = [
    { name: "Tempting Turkey Strips", category: "Treats", type_id: 4 },
    { name: "Irresistible Shrimp Snacks", category: "Treats", type_id: 4 },
    { name: "Gourmet Cheese Puffs", category: "Treats", type_id: 4 },
    { name: "Delectable Liver Bites", category: "Treats", type_id: 4 },
    { name: "Peanut Butter Poppers", category: "Treats", type_id: 4 },
  ];

  const Potion = [
    { name: "Healing Elixir", category: "Potion", type_id: 5 },
    { name: "Energy Boost Tonic", category: "Potion", type_id: 5 },
    { name: "Calming Potion", category: "Potion", type_id: 5 },
    { name: "Revitalizing Serum", category: "Potion", type_id: 5 },
    { name: "Magical Transformation Elixir", category: "Potion", type_id: 5 },
  ];

  const Costume = [
    { name: "Pirate Cat Costume", category: "Costume", type_id: 6 },
    { name: "Superhero Cape and Mask", category: "Costume", type_id: 6 },
    { name: "Elegant Princess Dress", category: "Costume", type_id: 6 },
    { name: "Dapper Gentleman Suit", category: "Costume", type_id: 6 },
    { name: "Hilarious Clown Outfit", category: "Costume", type_id: 6 },
  ];

  const GroomingSupplies = [
    { name: "Soft Bristle Brush", category: "Grooming Supplies", type_id: 7 },
    { name: "Shedding Comb", category: "Grooming Supplies", type_id: 7 },
    { name: "Nail Clippers", category: "Grooming Supplies", type_id: 7 },
    { name: "Soothing Shampoo", category: "Grooming Supplies", type_id: 7 },
    { name: "Gentle Ear Cleaner", category: "Grooming Supplies", type_id: 7 },
  ];

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
    type: randomItem.category,
    type_id: randomItem.type_id,
  };
}

function generateItemRarity() {
  const rarities = [
    { id: 1, itemRarity: "Common", weight: 10 },
    { id: 2, itemRarity: "Uncommon", weight: 10 },
    { id: 3, itemRarity: "Rare", weight: 8 },
    { id: 4, itemRarity: "Epic", weight: 5 },
    { id: 5, itemRarity: "Legendary", weight: 2 },
    { id: 6, itemRarity: "Godlike", weight: 1 },
  ];

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
    const { name, type, rarity, ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ message: "Invalid owner" });
    }

    const insertQuery =
      "INSERT INTO items (name, type, rarity, ownerId) VALUES ($1, $2, $3, $4)";
    const values = [name, type, rarity, ownerId];
    await pool.query(insertQuery, values);

    return res.status(201).json({ message: "Item stored in inventory" });
  } catch (err) {
    console.error("Error while grabbing drop item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
