import Link from "next/link";
import Image from "next/image";

import appLogo from "@/public/logo.png";

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}: {
  heading: string;
  paragraph: string;
  linkName: string;
  linkUrl?: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <Image alt="Logo" className="h-14 w-14" src={appLogo} />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {paragraph}{" "}
        <Link
          href={linkUrl}
          className="font-medium text-primary hover:text-indigo-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}
