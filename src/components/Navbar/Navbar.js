"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isToggle, setIsToggle] = useState(false);

  const buttons = [
    {
      label: "Pay",
      path: "/dashboard",
      action: () => {
        router.push("/dashboard");
      },
    },
    {
      label: "Activity",
      path: "/activity",
      action: () => {
        router.push("/activity");
      },
    },
    {
      label: "History",
      path: "/history",
      action: () => {
        router.push("/history");
      },
    },
    {
      label: "Settings",
      path: "/settings",
      action: () => {
        router.push("/settings");
      },
    },
  ];

  return (
    <>
      <div className="justify-around items-center mt-2 hidden md:flex font-Montserrat select-none">
        <div className="flex items-center w-full">
          <Image
            src="logo-enhanced.png"
            alt="Logo"
            width={80}
            height={80}
          />
          <h1 className="flex flex-col text-start font-semibold space-y-[-5px]">
            <span className="text-md">Fee Tracker</span>
            <span className="tracking-wider font-mono font-[500] text-[8px]">
              Est. 2023-2024
            </span>
          </h1>
        </div>
        <div className="w-full hidden md:flex justify-center md:justify-end items-center px-5  font-Montserrat space-x-3 select-none">
          {buttons.map((button, index) => (
            <button
              className={`${
                pathname === button.path
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-400 hover:text-white hover:scale-110 transition delay-75 duration-500 ease-in-out"
              } text-[18px] w-24 py-2 rounded-3xl `}
              key={index}
              onClick={button.action}>
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex md:hidden bottom-4 left-3 fixed z-50">
        <button
          className="text-5xl font-normal z-10 text-green-400"
          onClick={() => setIsToggle(!isToggle)}>
          {isToggle ? "▼" : "▲"}
        </button>
      </div>

      {isToggle && (
        <div className="z-10 w-full bg-white border-t-2 border-[#357112] py-5 px-20 rounded-t-3xl flex flex-col md:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 gap-y-4">
          {buttons.map((button, index) => (
            <button
              className={`${
                pathname === button.path
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-400 hover:text-white"
              } w-full  py-2 text-[18px] rounded-2xl border border-[#357112]`}
              key={index}
              onClick={button.action}>
              {button.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
