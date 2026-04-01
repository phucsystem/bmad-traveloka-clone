import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TravelClone Admin",
  description: "Admin dashboard for TravelClone",
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
