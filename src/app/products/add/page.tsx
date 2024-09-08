import React from "react";
import ProductAddForm from "./product-add-form";

const page = () => {
  return (
    <>
      <h1 className="mb-10 text-center">Thêm sản phẩm</h1>
      <div className="w-[500px] mx-auto">
        <ProductAddForm></ProductAddForm>
      </div>
    </>
  );
};

export default page;
