import Settings from "@/components/Settings/Settings";
import Protected from "../../../Protected";

export default function SettingsRoute() {
  return (
    <Protected>
      <Settings />
    </Protected>
  );
}
