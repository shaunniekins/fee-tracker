// import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "Settings | LCO Fee Tracker",
  description: "Settings | LCO Fee Tracker",
};

export default function SettingsLayout({ children }) {
  return (
    <section className="container mx-auto w-screen h-[100dvh] flex flex-col select-none overflow-x-hidden no-scrollbar">
      <Navbar />
      {children}
    </section>
  );
}
