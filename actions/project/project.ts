"use server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberSchema, ProjectSchema } from "@/schema";
import * as z from "zod";
import jwt from "jsonwebtoken";
import { User } from "lucia";
import { Prisma } from "@prisma/client";
import { mailOptions, transporter } from "@/lib/nodemailer";

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
        ProjectMembers: {
          create: [
            {
              userId: user.id,
              role: "ADMIN",
            },
          ],
        },
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
  try {
    const projects = await db.project.findMany({
      where: {
        OR: [
          { userId: id },
          {
            ProjectMembers: {
              some: {
                userId: id,
              },
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            ProjectMembers: true,
            Tasks: true,
          },
        },
      },
    });

    return projects;
  } catch (err) {
    return null;
  }
};

export const getProjectById = async (id: string) => {
  const project = await db.project.findFirst({
    where: {
      id,
    },
    include: {
      Tasks: true,
      ProjectMembers: {
        include: {
          user: true,
        },
      },
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

    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: "Invitation to a task management project",
      text: "Invited to work on a project together",
      html: `<h1>You have been invited to work on a project together</h1> 
      <p>Please click <a href="http://localhost:3000/project/invite/${token}">this</a> to view invitation.</p>`,
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

export const updateProjectById = async (
  id: string,
  values: z.infer<typeof ProjectSchema>
) => {
  const validatedFields = ProjectSchema.safeParse(values);

  if (!validatedFields.success) {
    // If validation is unsuccessful,
    return { error: "Invalid fields" };
  }

  const { name } = validatedFields.data;

  try {
    await db.project.update({
      data: {
        name,
      },
      where: {
        id,
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

export const deleteProjectById = async (id: string) => {
  try {
    await db.$transaction([
      db.tasks.deleteMany({
        where: {
          projectId: id,
        },
      }),
      db.projectMembers.deleteMany({
        where: {
          projectId: id,
        },
      }),
      db.invitation.deleteMany({
        where: {
          projectId: id,
        },
      }),
      db.project.delete({
        where: {
          id,
        },
      }),
    ]);
  } catch (err) {
    console.log(err);
    return {
      error: "An unexpected error occurred, Please try again later!!",
    };
  }
};
