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
import { TaskStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { fetchTaskByStatus } from "@/actions/task/task";
import { useProject } from "@/providers/ProjectProvider";

function Droppable({ id, label }: { id: TaskStatus; label: string }) {
  const { setNodeRef } = useDroppable({
    id,
  });
  const [open, setOpen] = useState(false);
  const projectId = useProject();
  console.log(projectId);

  const { isPending, isError, data } = useQuery({
    queryKey: [`get-task-by-${id}`],
    queryFn: async () => await fetchTaskByStatus(id, projectId),
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="bg-red-400 min-h-96 min-w-64 p-2" ref={setNodeRef}>
      <h2>{label}</h2>
      <div className="bg-gray-500 flex flex-col gap-2 rounded-md p-4">
        {data?.map((el) => {
          return (
            <span className="border text-center p-2 rounded-sm" key={el.id}>
              {el.title}
            </span>
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
