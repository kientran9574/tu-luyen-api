import authRequests from "@/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 401,
      }
    );
  }
  try {
    const res = await authRequests.slideSessionFromNextServerToServer(
      sessionToken.value
    );
    const newExpiresDate = new Date(res.payload.data.expiresAt).toUTCString();
    return Response.json(res.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken};Path=/;HttpOnly;Expires=${newExpiresDate};SameSite=Lax;Secure`,
      },
    });
  } catch (error ) {
    console.log(error);
  }
}
