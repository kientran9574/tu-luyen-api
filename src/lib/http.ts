import envConfig from "@/config";
import { normalizePath } from "./utils";
import { LoginResType } from "@/utils/auth.schema";
import { redirect } from "next/navigation";
// khai báo cái customOptions để mình khai báo cho request params
type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;

const AUTHENTICATION_ERROR_STATUS = 401;

// format trả về lỗi liên quan tới form
type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

// Khi mà mình throw 1 cái lỗi gì đấy , throw 1 cái obj nó kế thừa obj Error để cho nó có thông tin lỗi , lỗi dòng mấy ,file mấy ...
export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    // ngoài message key ra thì còn những key khác mà tôi không có biết
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}
export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

// class này chỉ sử dụng ở môi trường client side thôi
class SessionToken {
  private token = "";
  private _expiresAt = new Date().toISOString();
  get value() {
    return this.token;
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set value server side");
    }
    this.token = token;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  set expiresAt(expiresAt: string) {
    // nếu gọi method này ở next server thì bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._expiresAt = expiresAt;
  }
}
// obj này chỉ thực hiện ở client side
export const clientSessionToken = new SessionToken();
// sử dụng biến clientLogoutRequest làm như vậy sẽ không stric mode nó gọi 2 lần api nữa
let clientLogoutRequest: null | Promise<any> = null;
// khai báo theo kiểu hàm
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  // khai báo body ra
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;
  // khai báo headers
  const baseHeaders =
    body instanceof FormData
      ? {
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        };
  //    khai báo baseUrl
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT gọi đến server backend
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;
  //  tránh trường hợp thiếu / khi người dùng có những apl như là /account/me
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;
  // khai báo fetch
  const res = await fetch(fullUrl, {
    // lấy options trên options?: CustomOptions | undefined
    ...options,
    headers: {
      // lấy cái headers mà mình config truyền vào này
      ...baseHeaders,
      // lấy headers từ bên ngoài truyền vào nữa (next server)
      ...options?.headers,
    } as any,
    body,
    method,
  });

  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // xử lý bên client component
      if (typeof window !== "undefined") {
        // sử dụng biến clientLogoutRequest làm như vậy sẽ không stric mode nó gọi 2 lần api nữa
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            // truyền lên 1 cái force
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            } as any,
          });
          await clientLogoutRequest;
          // sau khi mà logout thành công thì mình cũng set cái token client ""
          clientSessionToken.value = "";
          clientSessionToken.expiresAt = new Date().toISOString();
          clientLogoutRequest = null;
          location.href = "/login";
        }
      } else {
        // xử lý bên server component
        const sessionToken = (options?.headers as any).Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientSessionToken.value = (payload as LoginResType).data.token;
      clientSessionToken.value = (payload as LoginResType).data.expiresAt;
    } else if ("auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
      clientSessionToken.expiresAt = new Date().toISOString();
    }
  }

  return data;
};

// tạo các method
const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};
export default http;
