import http from "@/lib/http";
import { CreateProductBodyType, ProductResType } from "@/utils/product.schema";

const productApiRequest = {
  get: () => http.get("/products"),
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),
  // api upload hình ảnh
  uploadImg: (body: FormData) =>
    http.post<{
      message: string;
      data: string;
    }>("/media/upload", body),
};
export default productApiRequest;
