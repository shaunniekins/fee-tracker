"use client";
import { useState } from "react";
import Link from "next/link";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function DashboardRoute() {
  const [isUser, setIsUser] = useState(true);

  return <Dashboard />;
}
