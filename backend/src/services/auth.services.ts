// services/auth.services.ts - Lógica de registro y login
// - Persiste usuarios en users.json
// - Hashea passwords con bcrypt
// - Emite JWT con datos básicos del usuario
import type { IAuthUser, IUser } from "../interfaces/users.interface.ts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promises as fs } from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const filePath = join(__dirname, "../models/users.json");

// Lee el archivo JSON de usuarios
const readUsers = async (): Promise<IUser[]> => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

// Escribe el archivo JSON de usuarios
const writeUsers = async (users: IUser[]) => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
};

/**
 * Registra un nuevo usuario.
 * - Entrada: name, lastName, email, passwordHash (plano), phone?, address, role? (default 'user')
 * - Salida: status + mensaje + datos mínimos del usuario
 */
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
    role: (userData as any).role ?? "user",
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

/**
 * Autentica un usuario usando email + password (plano)
 * - Si coincide con el hash guardado genera un JWT por 1h
 */
export const loginUserService = async (userData: IAuthUser) => {
  if (!userData?.email || !userData?.passwordHash) {
    return { status: 400, message: "Missing email or passwordHash" };
  }

  const users = await readUsers();
  const user: IUser | undefined = users.find(u => u.email === userData.email);
  if (!user) return { status: 404, message: "User not found" };

  const isMatch = await bcrypt.compare(userData.passwordHash, user.passwordHash);
  if (!isMatch) return { status: 401, message: "Invalid credentials" };

  // Incluye más datos en el token (rol, nombre)
  const token = jwt.sign(
    { userId: user.userId, email: user.email, role: (user as any).role, name: (user as any).name },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );
  return { status: 200, message: "Login successful", token };
};

