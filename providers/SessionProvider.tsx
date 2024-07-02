"use client";
import React, { useContext } from "react";
import { Session, User } from "lucia";
import { createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface SessionProviderProps {
  session: Session | null;
  user: User | null;
}

const SessionContext = createContext<SessionProviderProps>(
  {} as SessionProviderProps
);

export const SessionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionProviderProps;
}) => {
  const queryClient = new QueryClient();

  return (
    <SessionContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext)
    throw new Error("useSession must be used within a session provider");

  return sessionContext;
};
