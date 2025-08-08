"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "./Button";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [csrfToken, setCsrfToken] = useState("");
  const isMounted = useRef(false);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get("/api/csrf", { withCredentials: true });
      if (response.data.csrfToken) {
        setCsrfToken(response.data.csrfToken);
      } else {
        toast.error("Failed to initialize security token");
        console.error("CSRF response missing token:", response.data);
      }
    } catch (err: any) {
      toast.error("Failed to initialize security token");
      console.error("CSRF fetch error:", err.message, err.response?.data);
      // Retry once after a short delay
      setTimeout(fetchCsrfToken, 1000);
    }
  };

  useEffect(() => {
    if (isMounted.current) return; // Prevent double fetch in Strict Mode
    isMounted.current = true;
    fetchCsrfToken();
    return () => {
      isMounted.current = false; // Cleanup on unmount
    };
  }, []);

  const handleLogout = async () => {
    if (!csrfToken) {
      toast.error("Security token not initialized");
      console.error("No CSRF token available for logout");
      return;
    }
    try {
      await axios.post(
        "/api/logout",
        {},
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        }
      );
      router.push("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Logout failed";
      toast.error(errorMessage);
      console.error("Logout error:", err.message, err.response?.data);
      await fetchCsrfToken(); // Refresh CSRF token on failure
    }
  };

  return (
    <nav className="bg-primary text-black p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          SecureApp
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {pathname === "/dashboard" && (
            <>
              <Link
                href="/dashboard"
                className="text-center text-sm hover:underline"
              >
                Dashboard
              </Link>
              <Button onClick={handleLogout} className="btn-secondary">
                Logout
              </Button>
            </>
          )}

          {/* GitHub Button */}
          <a
            href="https://github.com/hosseinskia/nextjs-csrf-login"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#4F46E5] text-white px-3 py-2 rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.29 3.438 9.772 8.205 11.363.6.111.82-.261.82-.577 0-.285-.011-1.041-.017-2.045-3.338.726-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.755-1.333-1.755-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.832 2.807 1.303 3.492.997.108-.775.419-1.303.762-1.604-2.665-.303-5.467-1.333-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.293-1.552 3.3-1.23 3.3-1.23.654 1.653.242 2.873.118 3.176.768.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.625-5.475 5.921.43.37.814 1.102.814 2.222 0 1.604-.014 2.896-.014 3.286 0 .318.218.694.825.576C20.565 22.27 24 17.788 24 12.5 24 5.87 18.627.5 12 .5z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
