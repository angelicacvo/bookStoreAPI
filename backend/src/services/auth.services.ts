import type { IAuthUser, IUser } from "../interfaces/users.interface.ts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promises as fs } from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const filePath = join(__dirname, "../models/users.json");

const readUsers = async (): Promise<IAuthUser[]> => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const writeUsers = async (users: any[]) => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
};

export const registerNewUserService = async (
  userData: Omit<IUser, "userId" | "createdAt" | "updatedAt">
) => {
  if (!userData?.email || !userData?.passwordHash) {
    return { status: 400, message: "Missing email or passwordHash" };
  }

  const users = await readUsers();

  // Verificar si ya existe el email
  const exists = users.find(u => u.email === userData.email);
  if (exists) return { status: 409, message: "User already registered" };

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);

  const newUser: IUser = {
    userId: (users[users.length - 1]?.userId ?? 0) + 1,
    ...userData,
    passwordHash: hashedPassword, 
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  await writeUsers(users);

  return {
    status: 200,
    message: "User registered successfully",
    user: { userId: newUser.userId, email: newUser.email, name: newUser.name, role: newUser.role }
  };
};

export const loginUserService = async (userData: IAuthUser) => {
  if (!userData?.email || !userData?.passwordHash) {
    return { status: 400, message: "Missing email or passwordHash" };
  }

  const users = await readUsers();
  const user = users.find(u => u.email === userData.email);
  if (!user) return { status: 404, message: "User not found" };

  const isMatch = await bcrypt.compare(userData.passwordHash, user.passwordHash);
  if (!isMatch) return { status: 401, message: "InvaluserId credentials" };

  const token = jwt.sign({ userId: user.userId, email: user.email }, "secretkey", { expiresIn: "1h" });
  return { status: 200, message: "Login successful", token };
};

