import {
  Food,
  Toys,
  Charms,
  Treats,
  Potion,
  Costume,
  GroomingSupplies,
} from "../constants/itemNameAndType";

export function getTypeArray(type: number) {
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

export function handleItemXPBoost(base: number, rarity: number) {
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
