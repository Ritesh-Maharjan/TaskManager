"use server";
import Invitation from "@/components/project/Invitation";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

const page = async ({ params }: any) => {
  const { id } = params;
  if (!id) {
    return <div>No token provided</div>;
  }
  const { user } = await validateRequest();

  if (!user) return <div>Please login</div>;

  try {
    const res = await db.invitation.findFirst({
      where: {
        token: id,
      },
    });
    if (!res) return <div>No token with {id} exists</div>;

    try {
      const project = await db.project.findFirst({
        where: {
          id: res.projectId,
        },
        include: {
          ProjectMembers: true,
        },
      });
      
      const userExists = project?.ProjectMembers.find(
        (member) => member.userId === user.id
      );

      if (userExists) return <div>You have already joined this project</div>;

      return (
        <Invitation
          projectName={project?.name!}
          projectId={res.projectId}
          user={user}
        />
      );
    } catch (err) {
      console.log(err);
      return <div>Something went wrong, Please try again later</div>;
    }
  } catch (err) {
    console.log("err", err);
    return <div>Something went wrong, Please try again later</div>;
  }
};

export default page;
