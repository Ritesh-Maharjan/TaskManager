import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ProjectSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-center mt-4 gap-4">
      <Card className="animate-pulse w-72">
        <CardHeader>
          <CardTitle className="h-2 w-20 self-center bg-slate-300 rounded"></CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="h-2 w-36 bg-slate-300 rounded"></p>
          <p className="h-2  w-36 bg-slate-300 rounded"></p>
        </CardContent>
      </Card>
      <Card className="animate-pulse w-72">
        <CardHeader>
          <CardTitle className="h-2 w-20 self-center bg-slate-300 rounded"></CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="h-2 w-36 bg-slate-300 rounded"></p>
          <p className="h-2  w-36 bg-slate-300 rounded"></p>
        </CardContent>
      </Card>
      <Card className="animate-pulse w-72">
        <CardHeader>
          <CardTitle className="h-2 w-20 self-center bg-slate-300 rounded"></CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="h-2 w-36 bg-slate-300 rounded"></p>
          <p className="h-2  w-36 bg-slate-300 rounded"></p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSkeleton;
