"use client";
import authRequests from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (sessionToken === clientSessionToken.value) {
      authRequests.logoutNextClientToServer(true, signal).then((res) => {
        router.push(`/login?redirectForm=${pathname}`);
      });
    }
    return () => {
      controller.abort();
    };
  }, [sessionToken, pathname, router]);
  return <div>Logout</div>;
};

export default Logout;
