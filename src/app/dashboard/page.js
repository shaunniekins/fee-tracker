"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dashboard from "@/components/Dashboard/Dashboard";
// import { supabase } from "../../utils/supabase";

export default function DashboardRoute() {
  return (
    <>
      <Dashboard />
    </>
  );
}
