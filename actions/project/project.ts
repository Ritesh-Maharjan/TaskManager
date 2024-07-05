"use server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberSchema, ProjectSchema } from "@/schema";
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

export const addMember = async (
  projectId: string,
  user: User,
  values: z.infer<typeof MemberSchema>
) => {
  const validatedFields = MemberSchema.safeParse(values);

  if (!validatedFields.success) {
    // If validation is unsuccessful,
    return { error: "Invalid fields" };
  }

  // const res = await validateRequest();
  // console.log(res);

  const { email } = validatedFields.data;

  const token = jwt.sign(
    {
      email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  try {
    const res = await db.invitation.create({
      data: {
        projectId,
        token,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong, Please try again later" };
  }
};

export const acceptInvite = async (id: string, userId: string) => {
  try {
    const invitation = await db.project.update({
      where: {
        id,
      },
      data: {
        ProjectMembers: {
          create: {
            userId,
          },
        },
      },
    });
    return invitation;
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong, Please try again later" };
  }
};
