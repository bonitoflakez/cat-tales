import { Request, Response, NextFunction } from "express";
import pool from "../models/db";

export const saveUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.body.username;
    const email = req.body.email;

    const usernameQuery = "SELECT * FROM userInfo WHERE username = $1";
    const emailQuery = "SELECT * FROM userInfo WHERE email = $1";

    const usernameResult = await pool.query(usernameQuery, [username]);
    const emailResult = await pool.query(emailQuery, [email]);

    if (usernameResult.rows.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    if (emailResult.rows.length > 0) {
      return res.status(409).json({ message: "Email already taken" });
    }

    next();
  } catch (err) {
    console.error("Error while checking for user:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

export default saveUser;
