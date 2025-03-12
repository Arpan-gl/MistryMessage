import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(3)
    .max(15)
    .trim()
    .regex(/^[a-zA-Z0-9]+$/,"username must not contain special character");

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email(),
    password:z.string().min(5),
});