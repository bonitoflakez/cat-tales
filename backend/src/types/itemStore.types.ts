import {
  Food,
  Toys,
  Charms,
  Treats,
  Potion,
  Costume,
  GroomingSupplies,
} from "../constants/itemNameAndType";

export interface StoreItem {
  name: string;
  type: string;
  type_id: number;
  rarity: Rarity;
  rarity_id: number;
  price: number;
}

export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Godlike";

export type ItemType =
  | (typeof Food)[number]
  | (typeof Toys)[number]
  | (typeof Charms)[number]
  | (typeof Treats)[number]
  | (typeof Potion)[number]
  | (typeof Costume)[number]
  | (typeof GroomingSupplies)[number];
