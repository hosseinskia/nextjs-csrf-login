import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "SecureApp - Secure Login & Dashboard",
  description:
    "A modern, secure Next.js application with CSRF-protected login and a user-friendly dashboard.",
  keywords:
    "Next.js, login, CSRF protection, dashboard, secure authentication, TypeScript, Tailwind CSS",
  manifest: "/manifest.json",
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
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Next.js, login, CSRF protection, dashboard, secure authentication, TypeScript, Tailwind CSS"
        />
        <meta
          name="description"
          content="A modern, secure Next.js application with CSRF-protected login and a user-friendly dashboard."
        />
        <meta name="author" content="Amir Hossein Kia" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="google-site-verification"
          content="jh4M3O9h4h6N0abGGjbzdi09_MbPktaRKi7lnvAa3s8"
        />
      </head>
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <Navbar />
        <Analytics />
        <main>{children}</main>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
