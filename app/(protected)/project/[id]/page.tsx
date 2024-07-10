"use client";
import Droppable from "@/components/Droppable";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import React, { act, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { getProjectById } from "@/actions/project/project";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectProvider } from "@/providers/ProjectProvider";
import { updateTask } from "@/actions/task/task";
import { TaskStatus } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddMember from "@/components/form/AddMember";

type PageProps = {
  params: { id: string };
};
const page = ({ params }: PageProps) => {
  const { id } = params;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const task = project?.Tasks.find((task) => task.id === active.id);

    if (task?.status === over.id) return;

    const res = await updateTask(active.id as string, over.id as TaskStatus);

    if (res) {
      // Invalidate and refetch the query
      queryClient.invalidateQueries({
        queryKey: ["get-task-by-ToDo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-task-by-Ongoing"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-task-by-Completed"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-projects-by-id"],
      });
    }
  };

  const {
    isPending,
    error,
    data: project,
  } = useQuery({
    queryKey: ["get-projects-by-id"],
    queryFn: async () => await getProjectById(id),
    retry: true,
    retryDelay: 500,
  });

  if (error) {
    return <div>Errors</div>;
  }
  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>No project</div>;
  }

  return (
    <ProjectProvider value={id}>
      <MaxWidthContainer classname="flex gap-2 flex-col">
        <header className="flex justify-between">
          <h1 className="font-bold text-xl text-center">{project.name}</h1>
          <div className="flex items-center gap-1">
            {/* Add New member */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="relative group w-fit">
                  <PlusCircledIcon className="hover:text-gray-700 cursor-pointer" />
                  <div className="absolute pointer-events-none left-1/2 transform -translate-x-1/2 top-full mt-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Add new Member
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription className="sr-only"></DialogDescription>
                <AddMember setOpen={setOpen} />
              </DialogContent>
            </Dialog>
            {(project?._count.ProjectMembers ?? 0) + 1} Members
          </div>
        </header>

        <DndContext onDragEnd={handleDragEnd}>
          <main className="flex flex-wrap gap-6 justify-center">
            <Droppable id={TaskStatus.ToDo} label="To Do" />
            <Droppable id={TaskStatus.Ongoing} label="Ongoing" />
            <Droppable id={TaskStatus.Completed} label="Completed" />
          </main>
        </DndContext>
      </MaxWidthContainer>
    </ProjectProvider>
  );
};

export default page;
