"use client";
import React, { useContext } from "react";
import { createContext } from "react";

const ProjectContext = createContext<string>("");

export const ProjectProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => {
  const projectContext = useContext(ProjectContext);

  if (!projectContext)
    throw new Error("useproject must be used within a project provider");

  return projectContext;
};
