"use client";
import React, { useEffect } from "react";
import envConfig from "@/config";
import authRequests from "@/apiRequests/auth";
import accountApiRequest from "@/apiRequests/account";

const Profile = () => {
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const result = await accountApiRequest.meClient();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequest();
  }, []);
  return <div>profile</div>;
};

export default Profile;
