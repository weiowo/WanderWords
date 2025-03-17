'use client';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'timeago.js';

interface User {
  username: string;
  email: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  createdAt: string;
  img?: string;
  user: User;
  desc: string;
}

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      <Link
        href={`/single-post?slug=${post.slug}`}
        className="md:hidden xl:block xl:w-2/5"
      >
        <Image
          src={post.img || '/images/default_img.webp'}
          alt={post.title}
          className="rounded-2xl object-cover w-full h-[250px]"
          width={600}
          height={250}
        />
      </Link>
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link
          href={`/single-post?slug=${post.slug}`}
          className="text-4xl font-semibold"
        >
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link
            href={`/posts?author=${post.user.email}`}
            className="text-blue-800"
          >
            {post.user.username}
          </Link>
          <span>on</span>
          <Link href={`/posts?cat=${post.category}`} className="text-blue-800">
            {post.category}
          </Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{post.desc}</p>
        <Link
          href={`/single-post?slug=${post.slug}`}
          className="underline text-blue-800 text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
