import Link from "next/link";
import React from "react";
import Logout from "./Logout";

const Header = () => {
  return (
    <>
      <ul className="flex justify-end gap-6 pr-4">
        <li>
          <Link
            className="inline-block text-black font-semibold text-xl"
            href={"/products/add"}
          >
            Thêm sản phẩm
          </Link>
        </li>
        <li>
          <Link
            className="inline-block text-black font-semibold text-xl"
            href={"/register"}
          >
            Đăng ký
          </Link>
        </li>
        <li>
          <Link
            className="inline-block text-black font-semibold text-xl"
            href={"/login"}
          >
            Đăng nhập
          </Link>
        </li>
        <li>
          <Link
            className="inline-block text-black font-semibold text-xl"
            href={"/"}
          >
            Back
          </Link>
        </li>
        <li>
          <Link
            className="inline-block text-black font-semibold text-xl"
            href={"/"}
          >
            <Logout></Logout>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
