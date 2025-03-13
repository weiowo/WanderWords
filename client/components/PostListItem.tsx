'use client';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'timeago.js';

// Define types for Post, User, and PostListItemProps
interface User {
  username: string;
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

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* image */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3">
          <Image
            src={post.img}
            alt={post.title}
            className="rounded-2xl object-cover"
            width={735} // Set the width here for Next.js Image component
            height={415} // Set the height based on aspect ratio (optional)
          />
        </div>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link href={`/${post.slug}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link
            href={`/posts?author=${post.user.username}`}
            className="text-blue-800"
          >
            {post.user.username}
          </Link>
          <span>on</span>
          <Link
            href={`/posts?category=${post.category}`}
            className="text-blue-800"
          >
            {post.category}
          </Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{post.desc}</p>
        <Link
          href={`/${post.slug}`}
          className="underline text-blue-800 text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
