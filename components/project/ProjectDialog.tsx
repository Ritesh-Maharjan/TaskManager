"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateProject from "../form/CreateProject";
import { buttonVariants } from "../ui/button";

const ProjectDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>
        Create Project
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription className="sr-only"></DialogDescription>
        <CreateProject setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
