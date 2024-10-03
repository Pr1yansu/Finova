"use server";
import { signOut } from "@/auth";

const logout = async () => {
  await signOut();
};

export default logout;
