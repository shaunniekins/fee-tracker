// import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "Dashboard | LCO Fee Tracker",
  description: "Dashboard | LCO Fee Tracker",
  openGraph: {
    images: "/public/lco-logo-enhanced.svg",
  },
};

export default function DashboardLayout({ children }) {
  return (
    <section className="container mx-auto w-screen h-[100dvh] flex flex-col select-none overflow-x-hidden no-scrollbar">
      <Navbar />
      {children}
    </section>
  );
}
