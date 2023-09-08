"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = ({ qrScannerVisible, toggleQrScanner }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isToggle, setIsToggle] = useState(false);

  const buttons = [
    {
      label: "Cam",
      condition: pathname === "/dashboard",
      action: () => {
        toggleQrScanner(); // Toggle QR scanner visibility
        setIsToggle(!isToggle);
      },
    },

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
    case "/dashboard/activity":
      pageTitle = "Activity | LCO Fee Tracker";
      pageDescription = "Activity";
      logoUrl = "../lco-logo-enhanced.svg";
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

      <div className="w-screen mt-5 hidden md:flex justify-center md:justify-end items-center px-5  font-Montserrat space-x-3 select-none">
        {buttons.map((button, index) =>
          button.condition ? (
            <button
              className="hover:bg-green-400 hover:text-white py-2 text-[18px] w-24 rounded-3xl "
              key={index}
              onClick={button.action}>
              {button.label}
            </button>
          ) : null
        )}
      </div>
      <div className="flex md:hidden bottom-1 left-1 absolute z-50">
        <button
          className="text-black text-3xl font-normal z-10"
          onClick={() => setIsToggle(!isToggle)}>
          ☰
        </button>
      </div>
      {isToggle && (
        <div className="z-10 w-full bg-white border-t-2 border-[#357112] py-5 px-20 rounded-t-3xl flex flex-col md:hidden absolute bottom-0 left-1/2 transform -translate-x-1/2  gap-y-4">
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
