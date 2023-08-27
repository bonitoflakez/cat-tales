INSERT INTO
  cat_types (type_name)
VALUES
  ('Common'),
  ('Uncommon'),
  ('Rare'),
  ('Epic'),
  ('Legendary'),
  ('Godlike');

INSERT INTO
  item_types (type_name)
VALUES
  ('Food'),
  ('Toys'),
  ('Charm'),
  ('Treats'),
  ('Potion'),
  ('Costume'),
  ('Grooming Supplies');

INSERT INTO
  item_rarity (rarity)
VALUES
  ('Common'),
  ('Uncommon'),
  ('Rare'),
  ('Epic'),
  ('Legendary'),
  ('Godlike');

INSERT INTO
  item_name (name, type_id)
VALUES
  ('Cat Food', 1),
  ('Cat Toy', 2),
  ('Cat Grooming Kit', 6),
  ('Cat Treat', 4),
  ('Interactive Cat Toy', 2),
  ('Cat Charm', 3),
  ('Cat Costume', 5);