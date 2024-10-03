import { currentUser } from "@/lib/auth";
import React from "react";

const WelcomeMsg = async () => {
  const user = await currentUser();
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Welcome Back, {user?.name?.split(" ")[0]} 👋
      </h2>
      <p className="text-white/70 text-sm lg:text-base">
        This is your financial Overview Report
      </p>
    </div>
  );
};

export default WelcomeMsg;
