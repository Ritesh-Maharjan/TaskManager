"use client";
import Droppable from "@/components/Droppable";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { DndContext } from "@dnd-kit/core";
import { getProjectById } from "@/actions/project/project";
import { useQuery } from "@tanstack/react-query";
import { ProjectProvider } from "@/providers/ProjectProvider";

type PageProps = {
  params: { id: string };
};
const page = ({ params }: PageProps) => {
  const { id } = params;

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
      <MaxWidthContainer>
        <header className="flex justify-between">
          <h1>{project.name}</h1>
          <div className="flex items-center gap-1">
            <div className="relative group w-fit">
              <PlusCircledIcon className="hover:text-gray-700 cursor-pointer" />
              <div className="absolute pointer-events-none left-1/2 transform -translate-x-1/2 top-full mt-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Add new item
              </div>
            </div>
            {(project?._count.ProjectMembers ?? 0) + 1} Members
          </div>
        </header>

        <DndContext>
          <main className="flex gap-2">
            <Droppable id="ToDo" label="To Do" />
            <Droppable id="Ongoing" label="Ongoing" />
            <Droppable id="Completed" label="Completed" />
          </main>
        </DndContext>
      </MaxWidthContainer>
    </ProjectProvider>
  );
};

export default page;
