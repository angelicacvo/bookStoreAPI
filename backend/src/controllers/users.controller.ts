import type { Request, Response } from "express";
import {
    getUsersService,
    getUserByIdService,
    postUserService,
    updateUserService,
    deleteUserService,
} from "../services/users.services.ts";

export const getUsersController = async (req: Request, res: Response) => {
  const users = await getUsersService();
  res.json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const user = await getUserByIdService(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};


export const postUserController = async (req: Request, res: Response) => {
  const newUser = await postUserService(req.body);
  res.status(201).json(newUser);
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const updatedUser = await updateUserService(userId, req.body);

    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const deleted = await deleteUserService(userId);
  if (!deleted) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted successfully" });
};