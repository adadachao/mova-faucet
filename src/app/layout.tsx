import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mova Faucet - Testnet Token Distribution",
  description: "Mova testnet token distribution platform for developers",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  themeColor: "#C1FF72",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mova Faucet"
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mova Faucet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#C1FF72" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
