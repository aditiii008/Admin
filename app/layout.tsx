import "./globals.css";

export const metadata = {
  title: "Admin Panel",
  description: "E-commerce Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
