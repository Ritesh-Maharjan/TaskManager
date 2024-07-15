"use server";

import { db } from "@/lib/db";
import { TaskSchema } from "@/schema";
import { TaskStatus } from "@prisma/client";
import * as z from "zod";

export const createTask = async (
  values: z.infer<typeof TaskSchema>,
  projectId: string,
  status: TaskStatus
) => {
  const validatedFields = TaskSchema.safeParse(values);

  if (!validatedFields.success) {
    // If validation is unsuccessful,
    return { error: "Invalid fields" };
  }

  const { title } = validatedFields.data;

  try {
    const task = await db.tasks.create({
      data: {
        title,
        projectId,
        status, // Set default status if needed
      },
      include: {
        project: true, // Include the project details in the response
      },
    });

    console.log(task);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchTaskByStatus = async (
  status: TaskStatus,
  projectId: string
) => {
  try {
    const res = await db.tasks.findMany({
      where: {
        status,
        projectId,
      },
    });

    const projectMembers = await db.projectMembers.findMany({
      where: {
        projectId,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateTask = async (id: string, status: TaskStatus) => {
  try {
    const res = await db.tasks.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const assignMemberToTask = async (taskId: string, userId: string) => {
  try {
    const res = await db.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        projectMembersId: userId,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong, Please try again later" };
  }
};

export const updateTaskTitle = async (
  taskId: string,
  values: z.infer<typeof TaskSchema>
) => {
  const validatedFields = TaskSchema.safeParse(values);

  if (!validatedFields.success) {
    // If validation is unsuccessful,
    return { error: "Invalid fields" };
  }

  const { title } = validatedFields.data;

  try {
    const res = await db.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        title,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "SOmething went wrong, Please try again later" };
  }
};

export const deleteTaskById = async (id: string) => {
  try {
    await db.tasks.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong, Please try again later." };
  }
};
