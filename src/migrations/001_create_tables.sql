CREATE TABLE userInfo (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL
);

CREATE TABLE cat_types (
  id SERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL
);

CREATE TABLE cats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rarity INTEGER REFERENCES cat_types(id),
  level INTEGER NOT NULL,
  charm VARCHAR(100),
  ownerId INTEGER REFERENCES players(id)
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
  ownerId INTEGER REFERENCES players(id)
);