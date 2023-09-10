"use client";

import TableData from "@/components/TableData/TableData";
import Protected from "../../../../Protected";

export default function DashboardActivityRoute() {
  return (
    <Protected>
      <TableData />
    </Protected>
  );
}
