"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isToggle, setIsToggle] = useState(false);

  const buttons = [
    {
      label: "Pay",
      condition: pathname === "/dashboard/activity" || pathname === "/history",
      action: () => {
        router.push("/dashboard");
      },
    },
    {
      label: "Activity",
      condition: pathname === "/dashboard" || pathname === "/history",
      action: () => {
        router.push("/dashboard/activity");
      },
    },
    {
      label: "History",
      condition:
        pathname === "/dashboard" || pathname === "/dashboard/activity",
      action: () => {
        router.push("/history");
      },
    },
    {
      label: "Logout",
      condition:
        pathname === "/dashboard" ||
        pathname === "/dashboard/activity" ||
        pathname === "/history",
      action: () => {
        router.push("/signin");
      },
    },
  ];

  return (
    <>
      <div className="w-screen mt-5 hidden md:flex justify-center md:justify-end items-center px-5  font-Montserrat space-x-5 select-none">
        {buttons.map((button, index) =>
          button.condition ? (
            <button
              className="hover:bg-green-400 hover:text-white py-2 text-[18px] w-24 rounded-2xl border border-[#357112]"
              key={index}
              onClick={button.action}>
              {button.label}
            </button>
          ) : null
        )}
      </div>
      <div className="flex md:hidden bottom-1 left-1 absolute">
        <button
          className="text-black text-3xl font-normal z-10"
          onClick={() => setIsToggle(!isToggle)}>
          ☰
        </button>
      </div>
      {isToggle && (
        <div className="z-0 w-full bg-white border-t-2 border-[#357112] py-5 px-20 rounded-t-3xl flex flex-col md:hidden absolute bottom-0 left-1/2 transform -translate-x-1/2  gap-y-4">
          {buttons.map((button, index) =>
            button.condition ? (
              <button
                className="w-full hover:bg-green-400 hover:text-white py-2 text-[18px] rounded-2xl border border-[#357112]"
                key={index}
                onClick={button.action}>
                {button.label}
              </button>
            ) : null
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;