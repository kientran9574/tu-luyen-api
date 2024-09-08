import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  MessageResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
} from "@/utils/auth.schema";

const authRequests = {
  login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/auth/register", body),
  auth: (body: { sessionToken: string; expiresAt: string }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logoutNextServerToServer: (sessionToken: string) => {
    return http.post<MessageResType>(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
  },
  logoutNextClientToServer: (
    force: boolean | undefined,
    signal: AbortSignal
  ) => {
    return http.post<MessageResType>(
      "/api/auth/logout",
      { force },
      {
        baseUrl: "",
        signal,
      }
    );
  },
  slideSessionFromNextServerToServer: (sessionToken: string) => {
    return http.post<SlideSessionResType>(
      "/auth/slide-session",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
  },
  slideSessionFromNextClientToNextServer: () => {
    return http.post<SlideSessionResType>(
      "/api/auth/slide-session",
      {},
      {
        baseUrl: "",
      }
    );
  },
};
export default authRequests;
