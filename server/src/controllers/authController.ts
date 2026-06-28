import bcrypt from "bcrypt";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import prisma from "../prisma/client";
import { generateToken } from "../utils/generateToken";

const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
};

export async function register(req: AuthenticatedRequest, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: "A user with that email already exists" });
    }

    // bcrypt stores a one-way hash so plain text passwords never go into the database.
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });

    res.status(201).json({
      user: toSafeUser(user),
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Could not register user" });
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: toSafeUser(user),
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Could not log in" });
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({ user: toSafeUser(req.user) });
}
