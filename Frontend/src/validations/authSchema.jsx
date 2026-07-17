import { z } from "zod";

export const signUpSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters"),

    email: z
        .string()
        .email("Please enter a valid email"),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(50, "Password is too long"),
});

export const signInSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});