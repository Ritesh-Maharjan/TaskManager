// "use client";
import React from "react";
import { validateRequest } from "@/lib/auth";

const page = async () => {
  // grab the user and session
  const user = await validateRequest();

  return <div>{user?.user?.id ? user?.user.id : "test"}</div>;
};

export default page;
