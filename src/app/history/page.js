import History from "@/components/History/History";
import Protected from "../../../Protected";

export default function HistoryRoute() {
  return (
    <Protected>
      <History />
    </Protected>
  );
}
