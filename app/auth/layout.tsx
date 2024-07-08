import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen my-6 sm:-mt-14 sm:mb-0 flex-col justify-center items-center ">
      {children}
    </div>
  );
};

export default layout;
