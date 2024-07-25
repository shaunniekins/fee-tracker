import "./globals.css";

export const metadata = {
  title: "Fee Tracker",
  description: "Fee Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-enhanced.png" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
