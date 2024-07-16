"use client";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "./ui/button";
import CreateTask from "./form/CreateTask";
import { MemberRole, TaskStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { fetchTaskByStatus } from "@/actions/task/task";
import { useProject } from "@/providers/ProjectProvider";
import Draggable from "./Draggable";
import DroppableSkeleteon from "./loading/DroppableSkeleteon";

interface ProjectMembers {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
  id: string;
  projectId: string;
  role: MemberRole;
  invitedAt: Date;
  joinedAt: Date;
  userId: string;
}

function Droppable({
  projectMembers,
  id,
  label,
}: {
  projectMembers: ProjectMembers[];
  id: TaskStatus;
  label: string;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });
  const [open, setOpen] = useState(false);
  const projectId = useProject();

  const { isPending, isError, data } = useQuery({
    queryKey: [`get-task-by-${id}`],
    queryFn: async () => await fetchTaskByStatus(id, projectId),
    retry: true,
    retryDelay: 500,
  });

  if (isPending) {
    return <DroppableSkeleteon />;
  }

  return (
    <div
      className="bg-gray-200 min-h-96 w-64 p-4 rounded-lg flex flex-col gap-4"
      ref={setNodeRef}
    >
      <h2 className="text-lg font-medium">{label}</h2>
      <div className="bg-gray-400 flex flex-col gap-2 rounded-md p-4">
        {data?.map((el) => {
          return (
            <Draggable
              projectMembers={projectMembers}
              key={el.id}
              task={el}
              taskStatus={id}
            />
          );
        })}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={buttonVariants({ variant: "ghost" })}>
            Create Task
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription className="sr-only"></DialogDescription>
            <CreateTask id={id} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Droppable;
