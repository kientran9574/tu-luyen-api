"use server";
import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";


export async function POST(request: Request) {
  const res = await request.json();
  // force này là mình truyền từ client lên
  const force = res.force as boolean | undefined;
  // Nếu như mà thằng client truyền lên là giá trị là force nằm trong cái body thì mình sẽ xóa logout xóa đi cái cookies
  if (force) {
    return Response.json("Buộc đăng xuất thành công", {
      status: 200,
      headers: {
        // Xóa cookie sessionToken
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
  }
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
    const result = await authApiRequest.logoutNextServerToServer(
      sessionToken.value
    );
    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Xóa cookie sessionToken
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
