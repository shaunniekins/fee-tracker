import { Suspense } from "react";

import TableData from "./TableData";
import Protected from "../../../Protected";
import LoadingThreeDots from "@/components/LoadingDots/LoadingThreeDots";

export default function ActivityRoute() {
  return (
    <Suspense fallback={<LoadingThreeDots />}>
      <Protected>
        <TableData />
      </Protected>
    </Suspense>
  );
}
