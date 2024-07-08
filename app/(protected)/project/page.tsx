"use client";
import { getProjects } from "@/actions/project/project";
import ProjectSkeleton from "@/components/loading/ProjectSkeleton";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import Project from "@/components/project/Project";
import ProjectDialog from "@/components/project/ProjectDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/providers/SessionProvider";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const page = () => {
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
      ) : data ? (
        <div className="flex flex-wrap justify-center mt-4 gap-4">
          {data.map((project) => (
            <Project project={project} />
          ))}
        </div>
      ) : (
        <div>
          <p>Current you don't have any Projects.</p>
          <ProjectDialog />
        </div>
      )}
    </MaxWidthContainer>
  );
};

export default page;
