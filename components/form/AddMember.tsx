"use client";
import { MemberSchema, ProjectSchema, TaskSchema } from "@/schema";
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
import { useMutation } from "@tanstack/react-query";
import { useProject } from "@/providers/ProjectProvider";
import { addMember } from "@/actions/project/project";

const AddMember = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { toast } = useToast();
  const projectId = useProject();
  const user = useSession().user!;
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof MemberSchema>>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof MemberSchema>) =>
      await addMember(projectId, user, values),
    retry: true,
    retryDelay: 500,
    onSuccess: () => {
      toast({
        title: "Email sent Successfully",
      });
      setOpen(false);
    },
    onError: (err) => {
      console.log(err);
      setError("something went wrong, Please try again later");
    },
  });

  const { mutate, isPending } = mutation;

  function onSubmit(values: z.infer<typeof MemberSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          Invite
        </Button>
        {error && <p className="text-destructive">{error}</p>}
      </form>
    </Form>
  );
};

export default AddMember;
