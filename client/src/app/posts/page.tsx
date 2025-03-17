'use client';
import { useState } from 'react';
import PostList from '@/components/PostList';
import SideMenu from '@/components/SideMenu';

export default function PostListPage() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full max-w-[1200px]">
      {/* <h1 className="mb-8 text-2xl">Development Blog</h1> */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? 'Close' : 'Filter or Search'}
      </button>
      <div className="w-full flex flex-col-reverse gap-8 md:flex-row justify-between">
        <div className="w-full min-w-[70%] h-full">
          <PostList />
        </div>
        <div className={`${open ? 'block' : 'hidden'} md:block`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
}
