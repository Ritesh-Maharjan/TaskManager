"use client";
import { ProjectSchema } from "@/schema";
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
import { createProject } from "@/actions/project/project";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const CreateProject = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useSession().user;
  const [error, setError] = useState<string>("");
  
  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof ProjectSchema>) {
    if (!user) {
      router.push("/auth/login");
    } else {
      startTransition(async () => {
        const result = await createProject(values, user);
        if (result?.error) {
          setError(result.error);
        } else {
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ["get-projects"] });
          toast({
            title: "Project Created Successfully",
          });
          setOpen(false);
        }
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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

export default CreateProject;
