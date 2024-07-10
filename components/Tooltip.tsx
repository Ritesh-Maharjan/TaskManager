import React, { ReactNode } from "react";

const Tooltip = ({ children, text }: { children: ReactNode; text: string }) => {
  return (
    <div className="relative group w-fit">
      {children}
      <div className="absolute pointer-events-none left-1/2 transform -translate-x-1/2 top-full mt-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
