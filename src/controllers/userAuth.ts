import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import pool from '../models/db';

const secretKey: Secret = process.env.SECRET_KEY || 'supersecuresecret';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = 'INSERT INTO userInfo (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const insertUserValues = [username, email, hashedPassword];

    const { rows: [user] } = await pool.query(insertUserQuery, insertUserValues);

    if (user) {
      let token = jwt.sign(
        {
          id: user.id,
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

      // Insert just the username into the players table
      const insertPlayerQuery = 'INSERT INTO players (username) VALUES ($1)';
      const insertPlayerValues = [user.username];
      await pool.query(insertPlayerQuery, insertPlayerValues);

      return res.status(201).send({
        authStatus: "user registered",
        message: {
          username: user.username,
          email: user.email,
          hashedPass: user.password,
        },
      });
    } else {
      return res.status(401).send({
        authStatus: "unable to register user",
        message: "Some error occurred",
      });
    }
  } catch (err) {
    console.error('Error while registering user:', err)
    res.status(500).send({ message: 'Internal server error' });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const getUserQuery = 'SELECT * FROM userInfo WHERE username = $1';
    const getUserValues = [username];

    const { rows: [userData] } = await pool.query(getUserQuery, getUserValues);

    if (userData) {
      const isSame = await bcrypt.compare(password, userData.password);

      if (isSame) {
        let token = jwt.sign(
          {
            id: userData.id,
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
            hashedPass: userData.password,
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
    console.error('Error while loggin in:', err)
    res.status(500).send({ message: 'Internal server error' });
  }
};
