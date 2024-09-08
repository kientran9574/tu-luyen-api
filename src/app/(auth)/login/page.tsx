import React from "react";
import Login from "./Login";

const page = () => {
  return (
    <>
      <h1 className="font-semibold text-center text-3xl">Đăng nhập</h1>
      <div className="flex justify-center">
        <Login></Login>
      </div>
    </>
  );
};

export default page;
