"use client";
import { TaskSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { updateTaskTitle } from "@/actions/task/task";

// Define ref type
interface ChildFormRef {
  submitForm: () => void;
}

interface UpdateTaskProps {
  id: string;
  title: string;
  taskStatus: string;
  setEditStatus: (param: boolean) => void;
}

const UpdateTask = React.forwardRef<ChildFormRef, UpdateTaskProps>(
  ({ id, title, taskStatus, setEditStatus }, ref) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof TaskSchema>>({
      resolver: zodResolver(TaskSchema),
      defaultValues: {
        title,
      },
    });

    function onSubmit(values: z.infer<typeof TaskSchema>) {
      startTransition(async () => {
        const result = await updateTaskTitle(id, values);
        if (result?.error) {
          toast({
            title: "Something went wrong, Please try again later.",
          });
        } else {
          // Invalidate and refetch the query
          await queryClient.invalidateQueries({
            queryKey: [`get-task-by-${taskStatus}`],
          });
          toast({
            title: "Task title Update Successfully",
          });
        }

        setEditStatus(false);
      });
    }

    useImperativeHandle(ref, () => ({
      submitForm: form.handleSubmit(onSubmit),
    }));

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
                    placeholder="Update task title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);

export default UpdateTask;
