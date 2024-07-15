import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { MemberRole, TaskStatus } from "@prisma/client";
import React, { MouseEvent, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Tooltip from "./Tooltip";
import { CheckIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { UserRoundPlus } from "lucide-react";
import Avatar from "react-avatar";
import { assignMemberToTask } from "@/actions/task/task";
import { useToast } from "./ui/use-toast";
import { QueryClient } from "@tanstack/react-query";

interface TaskProps {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  projectMembersId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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

const Draggable = ({
  task,
  projectMembers,
  taskStatus,
}: {
  task: TaskProps;
  projectMembers: ProjectMembers[];
  taskStatus: string;
}) => {
  const [assign, setAssign] = useState(false);
  const { toast } = useToast();
  const queryClient = new QueryClient();
  let assignedUser;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const assignTask = async (member: ProjectMembers) => {
    setAssign(!assign);
    const result = await assignMemberToTask(task.id, member.id);

    if ("error" in result) {
      toast({
        title: "Something went wrong, Please try again later",
      });
    } else {
      await queryClient.invalidateQueries({
        queryKey: [`get-task-by-${taskStatus}`],
      });
      toast({
        title: `Assigned this task to ${member.user.name}`,
      });
    }
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (task.projectMembersId) {
    assignedUser = projectMembers.find(
      (projectMember) => projectMember.id === task.projectMembersId
    );
  }

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "border text-center rounded-sm touch-none",
        transform && "bg-green-300"
      )}
      key={task.id}
      style={style}
    >
      <CardContent {...listeners} {...attributes} className="p-2 cursor-grab">
        {task.title}
      </CardContent>

      <hr className="h-0.5 bg-black/10 border-0" />

      <CardFooter className="flex justify-between p-2">
        <div className="relative">
          <Tooltip text="Assign task">
            {assignedUser ? (
              <Avatar
                onClick={() => setAssign(!assign)}
                className="rounded-full cursor-pointer"
                size="22"
                name={assignedUser.user.name ?? "User"}
              />
            ) : (
              <UserRoundPlus
                onClick={() => setAssign(!assign)}
                className="cursor-pointer"
                height="20"
                width="20"
              />
            )}
          </Tooltip>
          {assign && (
            <div className="absolute bg-black text-white flex flex-col w-36 z-10 rounded-lg">
              <h3 className="border-b-2 p-2">Assign this task</h3>
              {projectMembers.map((member) => (
                <button
                  onClick={() => assignTask(member)}
                  className="p-2  hover:bg-green-300 pointer-events-auto z-50"
                  key={member.id}
                >
                  {member.user.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 ">
          <Tooltip text="Save Changes">
            <CheckIcon className="cursor-pointer" height="20" width="20" />
          </Tooltip>
          <Tooltip text="Edit Heading">
            <Pencil1Icon className="cursor-pointer" height="20" width="20" />
          </Tooltip>
          <Tooltip text="Delete Project">
            <TrashIcon className="cursor-pointer" height="20" width="20" />
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Draggable;
