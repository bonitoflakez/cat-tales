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

export function generateItemNameAndType() {
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

export function generateItemRarity() {
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

export const calculateRarityXP = (base: number, rarity: number): number => {
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
