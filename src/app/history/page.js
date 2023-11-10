import { Suspense } from "react";
import History from "./History";
import Protected from "../../../Protected";
import LoadingThreeDots from "@/components/LoadingDots/LoadingThreeDots";

export default function HistoryRoute() {
  return (
    <Suspense fallback={<LoadingThreeDots />}>
      <Protected>
        <History />
      </Protected>
    </Suspense>
  );
}
