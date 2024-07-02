"use client";
import { ProjectSchema, TaskSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useProject } from "@/providers/ProjectProvider";
import { createTask } from "@/actions/task/task";
import { TaskStatus } from "@prisma/client";

const CreateTask = ({
  setOpen,
  id,
}: {
  setOpen: (open: boolean) => void;
  id: TaskStatus;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const projectId = useProject();
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof TaskSchema>) {
    startTransition(async () => {
      const result = await createTask(values, projectId, id);
      if (result?.error) {
        setError(result.error);
      } else {
        // Invalidate and refetch the query
        queryClient.invalidateQueries({ queryKey: [`get-task-by-${id}`] });
        toast({
          title: "Task Created Successfully",
        });
        setOpen(false);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter project title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
        {error && <p className="text-destructive">{error}</p>}
      </form>
    </Form>
  );
};

export default CreateTask;
