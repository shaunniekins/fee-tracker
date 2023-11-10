// import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "History | LCO Fee Tracker",
  description: "History | LCO Fee Tracker",
};

export default function HistoryLayout({ children }) {
  return (
    <section className="container mx-auto w-screen h-[100dvh] flex flex-col select-none overflow-x-hidden no-scrollbar">
      <Navbar />
      {children}
    </section>
  );
}
