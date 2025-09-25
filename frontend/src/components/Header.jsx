"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-surface border-b border-[#353535]">
      <div className="container mx-auto h-20 px-4 flex items-center justify-between ">
        <div className="flex flex-row gap-x-3">
          <Link href="/">
            <Image
              src="/shepherd-name.png"
              height={70}
              width={140}
              alt="Shepherd Logo"
            />
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/images/pfp.png"
            height={30}
            width={30}
            alt="Profile Picture"
          />
          <div className="flex flex-col">
            <p className="text-sm">PT</p>
            <p className="text-secondary text-sm">@0xps</p>
          </div>
        </div>
      </div>
    </div>
  );
}
