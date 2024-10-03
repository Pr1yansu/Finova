import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

interface SignOutProps {
  size?: "sm" | "default" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

const SignOut = ({
  size = "default",
  variant = "destructive",
  className,
  children,
  ...props
}: SignOutProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button
          type="submit"
          className={className}
          size={size}
          variant={variant}
          {...props}
        >
          {children}
        </Button>
      </form>
    </div>
  );
};

export default SignOut;
