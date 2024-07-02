"use client";
import { getProjects } from "@/actions/project/project";
import MaxWidthContainer from "@/components/MaxWidthContainer";
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

  if (isPending) return <h1>Loading....</h1>;

  if (error) return <h1>Error...</h1>;

  if (!data) {
    return (
      <MaxWidthContainer classname="flex flex-col gap-10 items-center justify-center min-h-[90vh]">
        <p>Current you don't have any Projects.</p>
        {/* Create project */}
        <ProjectDialog />
      </MaxWidthContainer>
    );
  } else {
    return (
      <MaxWidthContainer classname="flex flex-col">
        <div className="w-fit self-end">
          {/* Create project */}
          <ProjectDialog />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {data.map((project) => {
            return (
              <Link href={`project/${project.id}`}>
                <Card
                  className="hover:shadow-lg cursor-pointer"
                  key={project.id}
                >
                  <CardHeader>
                    <CardTitle className="text-center">
                      {" "}
                      {project.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <span>Total Members:</span>{" "}
                      {project._count.ProjectMembers}
                    </p>
                    <p>
                      <span>Total Tasks:</span> {project._count.Tasks}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </MaxWidthContainer>
    );
  }
};

export default page;
