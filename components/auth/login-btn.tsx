"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface LoginBtnProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginBtn = ({ children }: LoginBtnProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginBtn;
