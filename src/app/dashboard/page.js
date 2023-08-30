"use client";
import { useState } from "react";
import Link from "next/link";

export default function DashboardRoute() {
  const [isUser, setIsUser] = useState(true);

  return (
    <div className="w-screen h-screen flex flex-col items-center font-Montserrat bg-[#357112]">
      <h3 className="text-white text-xs bottom-0 mb-5 absolute">
        All Rights Reserved.
      </h3>
    </div>
  );
}
