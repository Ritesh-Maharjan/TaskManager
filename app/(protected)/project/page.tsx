"use client";
import { getProjects } from "@/actions/project/project";
import ProjectSkeleton from "@/components/loading/ProjectSkeleton";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import Project from "@/components/project/Project";
import ProjectDialog from "@/components/project/ProjectDialog";
import { useSession } from "@/providers/SessionProvider";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const user = useSession().user!;

  const { isPending, error, data } = useQuery({
    queryKey: ["get-projects"],
    queryFn: async () => await getProjects(user),
    retry: true,
    retryDelay: 500,
  });

  if (error) return <h1>Error...</h1>;

  return (
    <MaxWidthContainer classname="py-5 flex flex-col">
      <div className="w-fit self-end">
        {/* Create project */}
        <ProjectDialog />
      </div>

      {isPending ? (
        <ProjectSkeleton />
      ) : data && data?.length > 0 ? (
        <div className="flex flex-wrap justify-center mt-4 gap-4">
          {data.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[80vh] flex-col gap-4">
          <p>Current you don`&apos;`t have any Projects.</p>
          <ProjectDialog />
        </div>
      )}
    </MaxWidthContainer>
  );
};

export default Page;
