import Link from 'next/link';
import Comments from '@/components/Comments';
import Search from '@/components/Search';
import PostMenuActions from '@/components/PostMenuActions';

import axios from 'axios';
import { GetServerSideProps } from 'next';
import { format } from 'timeago.js';
import Image from 'next/image';

type User = {
  username: string;
  img?: string;
};

type Post = {
  _id: string;
  title: string;
  desc: string;
  img?: string;
  createdAt: string;
  user: User;
  category: string;
};

type SinglePostPageProps = {
  post: Post | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`,
    );
    return { props: { post: res.data } };
  } catch (error) {
    return { props: { post: null } };
  }
};

const SinglePostPage: React.FC<SinglePostPageProps> = ({ post }) => {
  if (!post) return <p>Post not found!</p>;

  return (
    <div className="flex flex-col gap-8">
      {/* Detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link href="#" className="text-blue-800">
              {post.user.username}
            </Link>
            <span>on</span>
            <Link href="#" className="text-blue-800">
              {post.category}
            </Link>
            <span>{format(post.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{post.desc}</p>
        </div>
        {post.img && (
          <div className="hidden lg:block w-2/5">
            <Image
              alt="post-img"
              src={post.img}
              width={600}
              className="rounded-2xl"
            />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* Menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {post.user.img && (
                <Image
                  alt="user-img"
                  src={post.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                />
              )}
              <Link href="#" className="text-blue-800">
                {post.user.username}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur
            </p>
            <div className="flex gap-2">
              <Link href="#">
                <Image
                  alt="facebook"
                  width={60}
                  height={60}
                  src="facebook.svg"
                />
              </Link>
              <Link href="#">
                <Image
                  alt="instagram"
                  width={60}
                  height={60}
                  src="instagram.svg"
                />
              </Link>
            </div>
          </div>
          <PostMenuActions post={post} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="#" className="underline">
              All
            </Link>
            <Link href="#" className="underline">
              Web Design
            </Link>
            <Link href="#" className="underline">
              Development
            </Link>
            <Link href="#" className="underline">
              Databases
            </Link>
            <Link href="#" className="underline">
              Search Engines
            </Link>
            <Link href="#" className="underline">
              Marketing
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={post._id} />
    </div>
  );
};

export default SinglePostPage;
