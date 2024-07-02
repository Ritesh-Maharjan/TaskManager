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
  console.log(status);
  try {
    const res = await db.tasks.findMany({
      where: {
        status,
        projectId,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};
