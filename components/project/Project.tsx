import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Project {
  _count: {
    ProjectMembers: number;
    Tasks: number;
  };
  id: string;
  name: string;
  userId: string;
}

const Project = ({ project }: { project: Project }) => {
  return (
    <Link key={project.id} href={`project/${project.id}`}>
      <Card className="hover:shadow-lg cursor-pointer w-72" key={project.id}>
        <CardHeader>
          <CardTitle className="text-center">{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <span>Total Members:</span>
            {project._count.ProjectMembers}
          </p>
          <p>
            <span>Total Tasks:</span> {project._count.Tasks}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Project;
