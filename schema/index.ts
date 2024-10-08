import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project title must be minimum of 3 character" }),
});

export const TaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Task title must be minimum of 3 character" }),
});

export const MemberSchema = z.object({
  email: z.string().email(),
});
