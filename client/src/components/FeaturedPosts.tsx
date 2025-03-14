'use client';

import { useRouter } from 'next/navigation';
// import Image from "./Image";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { format } from 'timeago.js';
import Image from 'next/image';

interface Post {
  img?: string;
  category: string;
  createdAt: string;
  slug: string;
  title: string;
}

interface FetchPostResponse {
  posts: Post[];
}

const fetchPost = async (): Promise<FetchPostResponse> => {
  const res = await axios.get<FetchPostResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?featured=true&limit=4&sort=newest`,
  );
  return res.data;
};

export default function FeaturedPosts() {
  const router = useRouter();
  const { isPending, error, data } = useQuery({
    queryKey: ['featuredPosts'],
    queryFn: fetchPost,
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Something went wrong! {error.message}</p>;

  const posts = data?.posts ?? [];
  if (posts.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* First Post */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {posts[0]?.img && (
          <Image
            alt="post"
            src={posts[0].img}
            className="rounded-3xl object-cover"
            width={895}
            height={300}
          />
        )}
        <div className="flex items-center gap-4">
          <h1 className="font-semibold lg:text-lg">01.</h1>
          <button
            className="text-blue-800 lg:text-lg"
            onClick={() => router.push(`/category/${posts[0].category}`)}
          >
            {posts[0].category}
          </button>
          <span className="text-gray-500">{format(posts[0].createdAt)}</span>
        </div>
        <button
          onClick={() => router.push(`/posts/${posts[0].slug}`)}
          className="text-xl lg:text-3xl font-semibold lg:font-bold"
        >
          {posts[0].title}
        </button>
      </div>

      {/* Other Posts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {posts.slice(1, 4).map((post, index) => (
          <div key={post.slug} className="lg:h-1/3 flex justify-between gap-4">
            {post.img && (
              <div className="w-1/3 aspect-video">
                <Image
                  alt="post"
                  src={post.img}
                  className="rounded-3xl object-cover w-full h-full"
                  width={298}
                  height={300}
                />
              </div>
            )}
            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="font-semibold">0{index + 2}.</h1>
                <button
                  className="text-blue-800"
                  onClick={() => router.push(`/category/${post.category}`)}
                >
                  {post.category}
                </button>
                <span className="text-gray-500 text-sm">
                  {format(post.createdAt)}
                </span>
              </div>
              <button
                onClick={() => router.push(`/posts/${post.slug}`)}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
              >
                {post.title}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
