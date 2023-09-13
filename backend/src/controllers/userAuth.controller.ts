import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import pool from "../models/db";

dotenv.config();

export const signUp = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_id = uuidv4();

    const insertUserQuery =
      "INSERT INTO userInfo (username, email, password, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const insertUserValues = [username, email, hashedPassword, user_id];

    const {
      rows: [user],
    } = await client.query(insertUserQuery, insertUserValues);

    if (!user) {
      await client.query("ROLLBACK");

      return res.status(401).send({
        authStatus: "unable to register user",
        message: "Some error occurred",
      });
    }

    const insertPlayerQuery =
      "INSERT INTO players (username, user_id) VALUES ($1, $2)";
    const insertPlayerValues = [user.username, user_id];
    await client.query(insertPlayerQuery, insertPlayerValues);

    const insertCurrencyQuery =
      "INSERT INTO currency (user_id, coins) VALUES ($1, $2)";
    const insertCurrencyValues = [user_id, 100];
    await client.query(insertCurrencyQuery, insertCurrencyValues);

    await client.query("COMMIT");

    return res.status(201).send({
      authStatus: "user registered",
      message: {
        username: user.username,
        email: user.email,
        user_id: user.user_id,
        coins: "100 coins added as signup reward",
      },
    });
  } catch (err) {
    console.error("Error while registering user:", err);
    res.status(500).send({ message: "Internal server error" });
  } finally {
    client.release();
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction // Add NextFunction parameter here
) => {
  const client = await pool.connect();
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const getUserQuery = "SELECT * FROM userInfo WHERE username = $1";
    const getUserValues = [username];

    const {
      rows: [userData],
    } = await client.query(getUserQuery, getUserValues);

    if (userData) {
      const isSame = await bcrypt.compare(password, userData.password);

      if (isSame) {
        const token = jwt.sign(
          {
            id: userData.user_id,
          },
          process.env.SECRET as Secret,
          {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          }
        );

        res.cookie("jwt", token, {
          maxAge: 1 * 24 * 60 * 60,
          httpOnly: true,
        });

        // return res.status(201).send({
        //   authStatus: "authorized",
        //   message: {
        //     username: userData.username,
        //     email: userData.email,
        //     user_id: userData.user_id,
        //   },
        //   token: token,
        // });

        next();
      } else {
        return res.status(401).send({
          authStatus: "unauthorized",
          message: "Invalid Password!",
        });
      }
    } else {
      return res.status(401).send({
        authStatus: "unauthorized",
        message: "Invalid user data",
      });
    }
  } catch (err) {
    console.error("Error while logging in:", err);
    res.status(500).send({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
