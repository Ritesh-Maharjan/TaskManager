import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { TaskStatus } from "@prisma/client";
import React from "react";

interface TaskProps {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  projectMembersId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
const Draggable = ({ task }: { task: TaskProps }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cn("border text-center p-2 rounded-sm", transform && "bg-green-300")}
      key={task.id}
      style={style}
      {...listeners}
      {...attributes}
    >
      {task.title}
    </div>
  );
};

export default Draggable;
