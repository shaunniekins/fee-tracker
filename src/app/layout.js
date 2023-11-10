import "./globals.css";

export const metadata = {
  title: "LCO Fee Tracker",
  description: "LCO Fee Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lco-logo-enhanced.svg" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
