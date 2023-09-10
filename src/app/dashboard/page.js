"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import Protected from "../../../Protected";

export default function DashboardRoute() {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
}
