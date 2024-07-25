// import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "Dashboard | Fee Tracker",
  description: "Dashboard | Fee Tracker",
  openGraph: {
    images: "/public/logo-enhanced.png",
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
