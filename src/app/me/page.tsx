"use server";
import envConfig from "@/config";
import React from "react";
import { cookies } from "next/headers";
import Profile from "./profile";
import authRequests from "@/apiRequests/auth";
import accountApiRequest from "@/apiRequests/account";
import ProfileForm from "./profile-form";

const page = async () => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const result = await accountApiRequest.me(sessionToken?.value ?? "");
  return (
    <>
      {/* {result.payload.data.email}

      <Profile></Profile> */}

      <ProfileForm profile={result.payload.data}></ProfileForm>
    </>
  );
};

export default page;
