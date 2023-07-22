# Dev setup

- **Language**: NodeJS, TypeScript
- **DataBase**: PostgreSQL

```env
USER='postgres'
PASSWD='user@postgres'
HOST='localhost'
PORT=5432
DB='cat_tale_db'
SECRET_KEY='supersecuresecret'
```

```text
# Install packages
npm install

# Compile TypeScript
npm run compile

# Create tables and insert important data
npm run initDB

# Run server on nodemon
npm run dev

# Run server on node
npm run main
```
