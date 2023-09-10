"use client";
import Signin from "../../components/Signin/Signin";

export default function SigninRoute() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center font-Montserrat bg-[#357112] gap-y-10">
      <div className="flex flex-col items-center top-0 absolute mt-5">
        <img
          className="w-20 h-20 md:w-32 md:h-32"
          src="lco-logo-enhanced.svg"
          alt="LCO Logo"
        />
        <h2 className="text-white font-[600]">LCO Fee Tracker</h2>
      </div>
      <div className="w-full flex justify-center px-5">
        <Signin />
      </div>
      <h3 className="text-white text-xs bottom-0 absolute mb-5">
        Est. 2023-2024
      </h3>
    </div>
  );
}
