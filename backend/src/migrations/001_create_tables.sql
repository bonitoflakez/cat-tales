CREATE TABLE userinfo (
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE players (
  username VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL UNIQUE,
  xp INTEGER DEFAULT 0 NOT NULL,
  last_claim_time TIMESTAMP
);

CREATE TABLE cat_types (
  id SERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL
);

CREATE TABLE cats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  rarity INTEGER REFERENCES cat_types(id),
  level INTEGER NOT NULL,
  charm VARCHAR(100),
  user_id VARCHAR(100) REFERENCES players(user_id),
  xp INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE item_types (
  id SERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL
);

CREATE TABLE item_rarity (
  id SERIAL PRIMARY KEY,
  rarity VARCHAR(100) NOT NULL
);

CREATE TABLE item_name (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type_id INTEGER REFERENCES item_types(id)
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type INTEGER REFERENCES item_types(id),
  rarity INTEGER REFERENCES item_rarity(id),
  user_id VARCHAR(100) REFERENCES players(user_id)
);

CREATE TABLE currency (
  user_id VARCHAR(100) UNIQUE REFERENCES players(user_id),
  coins INTEGER DEFAULT 100 NOT NULL
);