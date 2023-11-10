// import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "Activity | LCO Fee Tracker",
  description: "Activity | LCO Fee Tracker",
};

export default function ActivityLayout({ children }) {
  return (
    <section className="container mx-auto w-screen h-[100dvh] flex flex-col select-none overflow-x-hidden no-scrollbar">
      <Navbar />
      {children}
    </section>
  );
}
