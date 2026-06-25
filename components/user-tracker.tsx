"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function UserTracker() {
  const user = useCurrentUser();

  useEffect(() => {
    if (user && user.email) {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return "";
      };

      const deviceEmails = getCookie("finova_device_emails") || "";
      const emailsList = deviceEmails
        ? deviceEmails.split(",").map((e) => e.trim()).filter(Boolean)
        : [];

      if (!emailsList.includes(user.email)) {
        emailsList.push(user.email);
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1); // 1 year
        // Set cookie on client side
        document.cookie = `finova_device_emails=${emailsList.join(",")}; path=/; expires=${expires.toUTCString()}; SameSite=Lax; ${
          window.location.protocol === "https:" ? "Secure" : ""
        }`;
      }
    }
  }, [user]);

  return null;
}
