-- CREATE SEQUENCE userinfo_id_seq START 1;
CREATE TABLE userinfo (
  -- id INTEGER PRIMARY KEY DEFAULT nextval('userinfo_id_seq'),
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  uuid VARCHAR(100) NOT NULL UNIQUE
);

-- CREATE SEQUENCE players_id_seq START 1;
CREATE TABLE players (
  -- id INTEGER PRIMARY KEY DEFAULT nextval('players_id_seq'),
  username VARCHAR(100) NOT NULL,
  uuid VARCHAR(100) NOT NULL UNIQUE
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
  ownerId VARCHAR(100) REFERENCES players(uuid)
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
  ownerId VARCHAR(100) REFERENCES players(uuid)
);