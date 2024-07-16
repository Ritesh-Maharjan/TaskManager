import React from "react";
import MaxWidthContainer from "../MaxWidthContainer";
import DroppableSkeleteon from "./DroppableSkeleteon";

const IndividualProjectSkeleton = () => {
  return (
    <MaxWidthContainer classname="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="animate-pulse  rounded-3xl bg-slate-300 w-28 h-10"></div>
        <div className="animate-pulse  rounded-3xl bg-slate-300 w-48 h-10"></div>
      </div>

      <main className="flex flex-wrap gap-6 justify-center">
        <DroppableSkeleteon />
        <DroppableSkeleteon />
        <DroppableSkeleteon />
      </main>
    </MaxWidthContainer>
  );
};

export default IndividualProjectSkeleton;
