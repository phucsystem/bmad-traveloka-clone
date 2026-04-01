import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TravelClone — Budget Travel for Young Australians",
  description:
    "Find the best budget travel deals for flights and hotels across Australia and beyond.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
