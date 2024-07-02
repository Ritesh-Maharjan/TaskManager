"use server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProjectSchema } from "@/schema";
import * as z from "zod";
import jwt from "jsonwebtoken";
import { User } from "lucia";
import { Prisma } from "@prisma/client";
import { getProjectsByUser } from "@/data/project";

export const createProject = async (
  values: z.infer<typeof ProjectSchema>,
  user: User
) => {
  const validatedFields = ProjectSchema.safeParse(values);

  if (!validatedFields.success) {
    // If validation is unsuccessful,
    return { error: "Invalid fields" };
  }

  const { name } = validatedFields.data;

  try {
    await db.project.create({
      data: {
        name,
        userId: user.id,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        // Unique constraint failed error code
        return {
          error: "A project with this name already exists for this user.",
        };
      } else {
        return {
          error: "An unexpected error occurred, Please try again later!!",
        };
      }
    } else {
      return {
        error: "An unexpected error occurred, Please try again later!!",
      };
    }
  }
};

export const getProjects = async (user: User) => {
  const { id } = user;

  const projects = await getProjectsByUser(id);

  if (!projects || projects.length === 0) return null;

  return projects;
};

export const getProjectById = async (id: string) => {
  const project = await db.project.findFirst({
    where: {
      id,
    },
    include: {
      Tasks: true,
      _count: {
        select: {
          ProjectMembers: true,
          Tasks: true,
        },
      },
    },
  });
  return project;
};

// const code = Math.random().toString(36).substring(2, 8);

// const token = jwt.sign(
//   {
//     email: user.email,
//     code,
//   },
//   process.env.JWT_SECRET!,
//   {
//     expiresIn: "1d",
//   }
// );
