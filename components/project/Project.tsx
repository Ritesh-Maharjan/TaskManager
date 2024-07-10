"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import Tooltip from "../Tooltip";
import UpdateProject from "../form/UpdateProject";
import { deleteProjectById } from "@/actions/project/project";
import { useToast } from "../ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Project {
  _count: {
    ProjectMembers: number;
    Tasks: number;
  };
  id: string;
  name: string;
  userId: string;
}

// Define ref type
interface ChildFormRef {
  submitForm: () => void;
}

const Project = ({ project }: { project: Project }) => {
  const childRef = useRef<ChildFormRef>(null);
  const [editStatus, setEditStatus] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const changeHeading = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    setEditStatus(true);
  };

  const saveChanges = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    if (childRef.current) {
      childRef.current.submitForm();
    }
  };

  const deleteProject = async (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();

    const result = await deleteProjectById(project.id);

    if (result?.error) {
      toast({ title: result.error });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
      toast({ title: "Successfully deleted" });
    }
  };

  return (
    <Link key={project.id} href={`project/${project.id}`}>
      <Card className="hover:shadow-lg cursor-pointer w-72" key={project.id}>
        <CardHeader>
          {editStatus ? (
            <UpdateProject
              ref={childRef}
              id={project.id}
              setEditStatus={setEditStatus}
              title={project.name}
            />
          ) : (
            <CardTitle className="text-center">{project.name}</CardTitle>
          )}
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
        <CardFooter className="flex gap-2 justify-end">
          {editStatus ? (
            <Tooltip text="Save Changes">
              <CheckIcon onClick={saveChanges} height="20" width="20" />
            </Tooltip>
          ) : (
            <Tooltip text="Edit Heading">
              <Pencil1Icon onClick={changeHeading} height="20" width="20" />
            </Tooltip>
          )}
          <Tooltip text="Delete Project">
            <TrashIcon onClick={deleteProject} height="20" width="20" />
          </Tooltip>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Project;
