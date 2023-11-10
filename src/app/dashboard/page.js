import { Suspense } from "react";

import Dashboard from "@/app/dashboard/Dashboard";
import Protected from "@/../Protected";
import LoadingThreeDots from "@/components/LoadingDots/LoadingThreeDots";

export default async function DashboardRoute() {
  return (
    <Suspense fallback={<LoadingThreeDots />}>
      <Protected>
        <Dashboard />
      </Protected>
    </Suspense>
  );
}
