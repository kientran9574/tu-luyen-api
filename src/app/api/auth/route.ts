
export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken;
  const expiresAt = res.expiresAt 
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 400,
      }
    );
  }
  const expiresDate = new Date(expiresAt).toUTCString();
  return Response.json(sessionToken, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken};Path=/;HttpOnly;Expires=${expiresDate};SameSite=Lax;Secure`,
    },
  });
}
