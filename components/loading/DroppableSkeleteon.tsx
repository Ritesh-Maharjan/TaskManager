import React from "react";

const DroppableSkeleteon = () => {
  return (
    <div className="flex p-4 flex-col gap-4 animate-pulse  w-64  rounded-3xl bg-gray-200 h-96">
      <div className="animate-pulse w-32  rounded-3xl bg-slate-300 h-5"></div>
      <div className="animate-pulse w-full  rounded-3xl bg-slate-300 h-32"></div>
      <div className="animate-pulse w-full  rounded-3xl bg-slate-300 h-32"></div>
      <div className="animate-pulse w-full  rounded-3xl bg-slate-300 h-32"></div>
    </div>
  );
};

export default DroppableSkeleteon;
