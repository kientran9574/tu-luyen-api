"use client";
import { clientSessionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
  children,
  initialSession = "",
}: {
  children: React.ReactNode;
  initialSession?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSession;
    }
  });
  return <>{children}</>;
}
