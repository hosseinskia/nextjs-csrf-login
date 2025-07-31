import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Secure Next.js App",
  description: "A highly secure login and dashboard application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
