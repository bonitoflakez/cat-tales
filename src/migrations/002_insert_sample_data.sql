-- INSERT INTO
--   userInfo (username, email, password)
-- VALUES
--   ('player1', 'player1@example.com', 'password1'),
--   ('player2', 'player2@example.com', 'password2'),
--   ('player3', 'player3@example.com', 'password3');

-- INSERT INTO
--   players (username)
-- VALUES
--   ('player1'),
--   ('player2'),
--   ('player3');

INSERT INTO
  cat_types (type_name)
VALUES
  ('Common'),
  ('Uncommon'),
  ('Rare'),
  ('Epic'),
  ('Legendary'),
  ('Godlike');

-- INSERT INTO
--   cats (name, rarity, level, charm, ownerId)
-- VALUES
--   ('Fluffy', 1, 1, 'fluffy_charm.png', 1),
--   ('Whiskers', 3, 3, 'whiskers_charm.png', 2),
--   ('Midnight', 4, 5, 'midnight_charm.png', 3),
--   ('Mittens', 1, 2, 'mittens_charm.png', 1),
--   ('Shadow', 2, 4, 'shadow_charm.png', 1),
--   ('Pumpkin', 3, 2, 'pumpkin_charm.png', 2),
--   ('Luna', 5, 6, 'luna_charm.png', 3);

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

-- INSERT INTO
--   items (name, type, rarity, ownerId)
-- VALUES
--   ('Cat Food', 1, 1, 1),
--   ('Cat Toy', 3, 3, 2),
--   ('Cat Grooming Kit', 2, 2, 1),
--   ('Cat Treat', 4, 4, 3),
--   ('Interactive Cat Toy', 3, 2, 1),
--   ('Cat Charm', 5, 6, 2),
--   ('Cat Costume', 3, 4, 3);