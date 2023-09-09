import { rarities } from "../constants/itemRarity";

export const calculateRarityXP = (base: number, rarity: number): number => {
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
};

export const calculateLevelXP = (level: number): number => {
  let convertedXP = 100 * level;
  return convertedXP;
};

export function generateCatType() {
  const totalWeight = rarities.reduce((sum, rarity) => sum + rarity.weight, 0);

  const randomNumber = Math.floor(Math.random() * totalWeight) + 1;

  let cumulativeWeight = 0;
  for (const rarity of rarities) {
    cumulativeWeight += rarity.weight;
    if (randomNumber <= cumulativeWeight) {
      return {
        typeId: rarity.id,
        typeName: rarity.itemRarity,
      };
    }
  }

  return {
    typeId: rarities[0].id,
    typeName: rarities[0].itemRarity,
  };
}

export function generateCatLevel() {
  return Math.floor(Math.random() * 10) + 1;
}
