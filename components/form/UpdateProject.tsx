"use client";
import { ProjectSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { updateProjectById } from "@/actions/project/project";
import { useQueryClient } from "@tanstack/react-query";

// Define props type
interface ChildFormProps {
  id: string;
  setEditStatus: (editStatus: boolean) => void;
  title: string;
}

// Define ref type
interface ChildFormRef {
  submitForm: () => void;
}

const UpdateProject = forwardRef<ChildFormRef, ChildFormProps>(
  ({ id, setEditStatus, title }, ref) => {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string>("");

    const form = useForm<z.infer<typeof ProjectSchema>>({
      resolver: zodResolver(ProjectSchema),
      defaultValues: {
        name: title,
      },
    });

    async function onSubmit(values: z.infer<typeof ProjectSchema>) {
      setError("");

      const result = await updateProjectById(id, values);

      if (result?.error) {
        setError(result.error);
      } else {
        setEditStatus(false);
        await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
      }
    }

    useImperativeHandle(ref, () => ({
      submitForm: form.handleSubmit(onSubmit),
    }));

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.preventDefault();
    };

    // Handle key press event to prevent default behavior on Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(onSubmit)();
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter project title"
                    {...field}
                    aria-label="Project Title"
                    onClick={handleClick}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-destructive">{error}</p>}
        </form>
      </Form>
    );
  }
);

export default UpdateProject;
