'use client';

import { useState } from 'react';
import Image from 'next/image'; // Make sure this is using Next.js' Image component
import Link from 'next/link'; // Next.js Link for routing
// import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

// Component type definition
const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between px-8">
      {/* LOGO */}
      <Link
        href="/"
        passHref
        className="flex items-center gap-4 text-2xl font-bold"
      >
        <Image src="/images/logo.png" alt="Lama Logo" width={32} height={32} />
        <span>WanderWords</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {/* Hamburger Icon */}
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

        {/* MOBILE LINK LIST */}
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
          {/* <Link href="/posts?sort=popular" onClick={() => setOpen(false)}>Most Popular</Link> */}
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
        <Link href="/">Home</Link>
        <Link href="/posts?sort=trending">Trending</Link>
        {/* <Link href="/posts?sort=popular">Most Popular</Link> */}
        <Link href="/">About</Link>
        <SignedOut>
          <Link href="/sign-in">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              signin
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
