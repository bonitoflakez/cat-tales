import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../models/db";

const secretKey: Secret = "supersecuresecret";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_id = uuidv4();

    const insertUserQuery =
      "INSERT INTO userInfo (username, email, password, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const insertUserValues = [username, email, hashedPassword, user_id];

    const {
      rows: [user],
    } = await pool.query(insertUserQuery, insertUserValues);

    if (user) {
      let token = jwt.sign(
        {
          id: user.user_id,
        },
        secretKey,
        {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        }
      );

      res.cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60,
        httpOnly: true,
      });

      const insertPlayerQuery =
        "INSERT INTO players (username, user_id) VALUES ($1, $2)";
      const insertPlayerValues = [user.username, user_id];
      await pool.query(insertPlayerQuery, insertPlayerValues);

      const insertCurrencyQuery =
        "INSERT INTO currency (user_id, coins) VALUES ($1, $2)";
      const insertCurrencyValues = [user_id, 100];
      await pool.query(insertCurrencyQuery, insertCurrencyValues);

      return res.status(201).send({
        authStatus: "user registered",
        message: {
          username: user.username,
          email: user.email,
          user_id: user.user_id,
          coins: "100 coins added as signup reward",
        },
      });
    } else {
      return res.status(401).send({
        authStatus: "unable to register user",
        message: "Some error occurred",
      });
    }
  } catch (err) {
    console.error("Error while registering user:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
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
    } = await pool.query(getUserQuery, getUserValues);

    if (userData) {
      const isSame = await bcrypt.compare(password, userData.password);

      if (isSame) {
        let token = jwt.sign(
          {
            id: userData.user_id,
          },
          secretKey,
          {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          }
        );

        res.cookie("jwt", token, {
          maxAge: 1 * 24 * 60 * 60,
          httpOnly: true,
        });

        return res.status(201).send({
          authStatus: "authorized",
          message: {
            username: userData.username,
            email: userData.email,
            user_id: userData.user_id,
          },
        });
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
    console.error("Error while loggin in:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};
