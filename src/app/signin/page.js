"use client";
import { useState } from "react";
import Link from "next/link";
import Signin from "../../components/Signin/Signin";

export default function SigninRoute() {
  const [isUser, setIsUser] = useState(true);

  return (
    <div className="w-screen h-screen flex flex-col items-center font-Montserrat bg-[#357112]">
      <Link href="/" className="flex flex-col items-center mb-[80px] gap-y-3">
        <img
          className="w-32 h-32 mt-[50px]"
          src="lco-logo-enhanced.svg"
          alt="LCO Logo"
        />
        <h2 className="text-white font-[600]">LCO Fee Collection</h2>
      </Link>
      <div className="w-full flex justify-center px-5">
        <Signin isUser={isUser} setIsUser={setIsUser} />
      </div>
      <h3 className="text-white text-xs bottom-0 mb-5 absolute">
        All Rights Reserved.
      </h3>
    </div>
  );
}
