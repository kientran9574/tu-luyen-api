import http from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/utils/account.schema";

const accountApiRequest = {
  // api gọi ở môi trường server
  me: (sessionToken: string) =>
    http.get<AccountResType>("account/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  // api gọi ở môi trường client
  meClient: () => http.get<AccountResType>("account/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("account/me", body),
};
export default accountApiRequest;
