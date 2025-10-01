// schemas/user.schema.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  passwordHash: z.string().min(6, "Password must be at least 6 chars"),
  phone: z.number().optional(),
  address: z.string().min(1, "Address is required"),
  role: z.enum(["admin", "user"]),
});
