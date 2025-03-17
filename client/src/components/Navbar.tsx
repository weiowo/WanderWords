'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-center px-8">
      <div className="w-full max-w-[1200px] h-16 md:h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          passHref
          className="flex items-center gap-4 text-2xl font-bold"
        >
          <Image
            src="/images/logo.png"
            alt="Lama Logo"
            width={32}
            height={32}
          />
          <span>WanderWords</span>
        </Link>

        <div className="md:hidden">
          <div
            className="cursor-pointer text-4xl"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="flex flex-col gap-[5.4px]">
              <div
                className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                  open && 'rotate-45'
                }`}
              ></div>
              <div
                className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${
                  open && 'opacity-0'
                }`}
              ></div>
              <div
                className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                  open && '-rotate-45'
                }`}
              ></div>
            </div>
          </div>

          <div
            className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
              open ? '-right-0' : '-right-[100%]'
            }`}
          >
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/posts?sort=trending" onClick={() => setOpen(false)}>
              Trending
            </Link>
            <Link href="/" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/login" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
                Login 👋
              </button>
            </Link>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
          <SignedOut>
            <Link
              href="/sign-in"
              className="py-2 px-4 text-sm rounded-3xl bg-[#a98f6f] text-white"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
