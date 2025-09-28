import { promises as fs } from "fs";
import type { IUser } from "../interfaces/users.interface.ts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Rutas necesarias para encontrar el archivo users.json
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const filePath = join(__dirname, "../models/users.json");

// Leer todos los libros
const getUsersService = async (): Promise<IUser[]> => {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as IUser[];
};

// Buscar libro por ID
const getUserByIdService = async (userId: number): Promise<IUser | null> => {
    const users = await getUsersService();
    return users.find((u) => u.userId === userId) ?? null;
};

// Crear nuevo libro
const postUserService = async (
    userData: Omit<IUser, "userId" | "createdAt" | "updatedAt">
): Promise<IUser> => {
    const users = await getUsersService();

    const newUser: IUser = {
        userId: (users[users.length - 1]?.userId ?? 0) + 1, // autoincremental
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userData,
    };

    users.push(newUser);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    return newUser;
};

// Actualizar libro
const updateUserService = async (
    userId: number,
    userData: Partial<IUser>
): Promise<IUser | null> => {
    const users = await getUsersService();
    const index = users.findIndex((b) => b.userId === userId);
    if (index === -1) return null;

    const existing = users[index]
    if (!existing) {
        return null
    }

    const updatedUser: IUser = { ...existing, ...userData, userId: existing.userId };
    users[index] = updatedUser
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    return updatedUser;
};

// Eliminar libro
const deleteUserService = async (userId: number): Promise<boolean> => {
    const users = await getUsersService();
    const index = users.findIndex((b) => b.userId === userId);
    if (index === -1) return false;

    users.splice(index, 1);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    return true;
};

export {
    getUsersService,
    getUserByIdService,
    postUserService,
    updateUserService,
    deleteUserService,
};
