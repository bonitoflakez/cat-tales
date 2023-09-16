import { Request, Response, NextFunction } from "express";
import pool from "../models/db";

export const saveUser = (req: Request, res: Response, next: NextFunction) => {
  const client = pool.connect();

  const username = req.body.username;
  const email = req.body.email;

  if (!username || !email) {
    return res.status(403).json({
      message: "Missing username or email",
    });
  }

  client
    .then(async (client) => {
      try {
        const usernameQuery = "SELECT * FROM userInfo WHERE username = $1";
        const emailQuery = "SELECT * FROM userInfo WHERE email = $1";

        const usernameResult = await client.query(usernameQuery, [username]);
        const emailResult = await client.query(emailQuery, [email]);

        if (usernameResult.rows.length > 0) {
          return res.status(409).json({
            message: "Username already taken",
          });
        }

        if (emailResult.rows.length > 0) {
          return res.status(409).json({
            message: "Email already taken",
          });
        }

        next();
      } catch (err) {
        console.error("Error while checking for user: ", err);
        return res.status(500).send({
          message: "Internal server error",
        });
      } finally {
        client.release();
      }
    })
    .catch((error) => {
      console.error("Error acquiring a database client:", error);
      res.status(500).send({
        message: "Internal server error",
      });
    });
};

export default saveUser;
