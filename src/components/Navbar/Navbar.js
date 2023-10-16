"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../../supabase";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isToggle, setIsToggle] = useState(false);

  const buttons = [
    {
      label: "Pay",
      condition:
        pathname === "/activity" ||
        pathname === "/history" ||
        pathname === "/settings",
      action: () => {
        router.push("/dashboard");
      },
    },
    {
      label: "Activity",
      condition:
        pathname === "/dashboard" ||
        pathname === "/history" ||
        pathname === "/settings",
      action: () => {
        router.push("/activity");
      },
    },
    {
      label: "History",
      condition:
        pathname === "/dashboard" ||
        pathname === "/activity" ||
        pathname === "/settings",
      action: () => {
        router.push("/history");
      },
    },
    {
      label: "Settings",
      condition:
        pathname === "/dashboard" ||
        pathname === "/activity" ||
        pathname === "/history",
      action: () => {
        router.push("/settings");
      },
    },
    {
      label: "Logout",
      condition:
        pathname === "/dashboard" ||
        pathname === "/activity" ||
        pathname === "/history" ||
        pathname === "/settings",
      action: async () => {
        let { error } = await supabase.auth.signOut();
        router.push("/signin");
      },
    },
  ];

  let pageTitle, pageDescription, logoUrl;

  switch (pathname) {
    case "/dashboard":
      pageTitle = "Dashboard | LCO Fee Tracker";
      pageDescription = "Dashboard";
      logoUrl = "lco-logo-enhanced.svg";
      break;
    case "/history":
      pageTitle = "History | LCO Fee Tracker";
      pageDescription = "History";
      logoUrl = "lco-logo-enhanced.svg";
      break;
    case "/settings":
      pageTitle = "Settings | LCO Fee Tracker";
      pageDescription = "Settings";
      logoUrl = "lco-logo-enhanced.svg";
      break;
    case "/activity":
      pageTitle = "Activity | LCO Fee Tracker";
      pageDescription = "Activity";
      logoUrl = "lco-logo-enhanced.svg";
      break;

    default:
      pageTitle = "LCO Fee Tracker";
      pageDescription = "Track your fees with LCO Fee Tracker";
      logoUrl = "lco-logo-enhanced.svg";
      break;
  }

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} key="desc" />
      <link rel="icon" href={logoUrl} />

      <div className="w-screen justify-around items-center mt-2 hidden md:flex font-Montserrat select-none">
        <div className="flex items-center w-full">
          <Image
            src="lco-logo-enhanced.svg"
            alt="LCO Logo"
            width={80}
            height={80}
          />
          <h1 className="flex flex-col text-start font-semibold space-y-[-5px]">
            <span className="text-md">LCO Fee Tracker</span>
            <span className="tracking-wider font-mono font-[500] text-[8px]">
              Est. 2023-2024
            </span>
          </h1>
        </div>
        <div className="w-full hidden md:flex justify-center md:justify-end items-center px-5  font-Montserrat space-x-3 select-none">
          {buttons.map((button, index) =>
            button.condition ? (
              <button
                className="hover:bg-green-400 hover:text-white text-[18px] w-24 py-2 rounded-3xl "
                key={index}
                onClick={button.action}>
                {button.label}
              </button>
            ) : null
          )}
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
