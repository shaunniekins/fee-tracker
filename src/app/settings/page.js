import { Suspense } from "react";
import Settings from "./Settings";
import Protected from "../../../Protected";
import LoadingThreeDots from "@/components/LoadingDots/LoadingThreeDots";

export default function SettingsRoute() {
  return (
    <Suspense fallback={<LoadingThreeDots />}>
      <Protected>
        <Settings />
      </Protected>
    </Suspense>
  );
}
