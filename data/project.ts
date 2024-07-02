import { db } from "@/lib/db";

export const getProjectsByUser = async (id: string) => {
  try {
    const projects = await db.project.findMany({
      where: { userId: id },
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
