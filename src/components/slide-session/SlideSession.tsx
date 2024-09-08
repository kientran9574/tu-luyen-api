"use client";
import authRequests from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { differenceInHours } from "date-fns";
import React, { useEffect } from "react";

const SlideSession = () => {
  // check tự động , token tồn tại 10 tiếng thì , mỗi tiếng 1 lần , nếu như mà cái thời gian hết hạn nó bé hơn 1 tiếng thì mình sẽ gia hạn thời gian của exp
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date(); // đây là giá trị bây giờ
      const expiresAt = new Date(clientSessionToken.expiresAt); // đây là giá trị hết hạn

      // Nếu như mà giá trị bây giờ với giá trị hết hạn mà nó bé hơn 1 giờ thì mình sẽ gọi logic để cho nó set lại thời gian hết hạn , differenceInHours => so sánh thời gian
      if (differenceInHours(now, expiresAt) < 1) {
        const res = await authRequests.slideSessionFromNextClientToNextServer();
        clientSessionToken.expiresAt = res.payload.data.expiresAt;
      }
      return () => {
        clearInterval(interval);
      };
    }, 1000 * 60 * 60);
  }, []);
  return null;
};
export default SlideSession;
