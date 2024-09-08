"use client";
import React from "react";
import { Button } from "../ui/button";
import authRequests from "@/apiRequests/auth";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const result = await authRequests.logoutNextClientToServer();
      if (result as any) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return <Button onClick={() => handleLogout()}>Đăng xuất</Button>;
};

export default Logout;
