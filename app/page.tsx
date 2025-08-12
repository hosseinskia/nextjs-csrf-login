import Link from "next/link";
import Button from "../components/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center bg-white rounded-2xl shadow-xl p-8 animate-fade-in max-w-lg w-full mb-[146px] md:mb-0">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SecureApp
        </h1>
        <p className="text-gray-600 mb-6">
          A modern, secure platform for managing your dashboard with confidence.
        </p>
        <div className="space-y-4">
          <Link href="/login">
            <Button className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 w-full shadow-md">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
