"use client";
import React from "react";
import MaxWidthContainer from "../MaxWidthContainer";
import { Button } from "../ui/button";
import { User } from "lucia";
import { acceptInvite } from "@/actions/project/project";
import { useToast } from "../ui/use-toast";

const Invitation = ({
  projectName,
  projectId,
  user,
}: {
  projectName: string;
  projectId: string;
  user: User;
}) => {
  const { toast } = useToast();
  const acceptInvitation = async () => {
    const result = await acceptInvite(projectId, user.id);
    if ("error" in result) {
      toast({
        title: "Error",
        description: result.error,
      });
    } else {
      toast({
        title: "Success",
        description: "Invitation accepted successfully",
      });
    }
  };
  return (
    <MaxWidthContainer classname="items-center justify-center flex flex-col min-h-screen">
      <h2>You have been invited to join the {projectName} project</h2>
      <Button onClick={acceptInvitation} variant={"default"}>
        Accept Invite
      </Button>
    </MaxWidthContainer>
  );
};

export default Invitation;
