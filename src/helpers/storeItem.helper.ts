import { rarities } from "../constants/itemRarity";
import { Rarity } from "../types/itemStore.types";

// Store item cache for 24 hours
export const itemCache = new Map<string, { rarity: Rarity; price: number }>();

export const cacheItemData = (
  itemName: string,
  rarity: Rarity,
  price: number
) => {
  itemCache.set(itemName, { rarity, price });

  // Clear the cache entry after 24 hours
  setTimeout(() => {
    itemCache.delete(itemName);
  }, 24 * 60 * 60 * 1000);
};

export const getCachedItemData = (
  itemName: string
): { rarity: Rarity; price: number } | undefined => {
  return itemCache.get(itemName);
};

export const getRandomRarity = (): { id: number; itemRarity: Rarity } => {
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

export const calculatePrice = (basePrice: number, rarity: Rarity): number => {
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
