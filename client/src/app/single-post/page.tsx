'use client';
import Link from 'next/link';
import Comments from '@/components/Comments';
import Search from '@/components/Search';
import PostMenuActions from '@/components/PostMenuActions';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'timeago.js';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// type User = {
//   username: string;
//   img?: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   desc: string;
//   img?: string;
//   createdAt: string;
//   user: User;
//   category: string;
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { slug } = context.params as { slug: string };

//   try {
//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`,
//     );
//     return { props: { post: res.data } };
//   } catch (error) {
//     return { props: { post: null } };
//   }
// };

const fetchSinglePost = async (slug: string) => {
  const res = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`);
  return (await res).data;
};

export default function SinglePost() {
  const params = useSearchParams()?.get('slug') || '';
  const { isPending, error, data } = useQuery({
    queryKey: ['post', params],
    queryFn: () => fetchSinglePost(params as string),
  });

  if (isPending) return 'loading';
  if (error) return 'something went wrong' + error.message;
  if (!data) return 'post not found';
  return (
    <div className="w-full max-w-[1200px] flex flex-col gap-8">
      {/* Detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link
              href={`/posts?author=${data.user.email}`}
              className="text-blue-800"
            >
              {data.user.username}
            </Link>
            <span>on</span>
            <Link
              href={`/posts?cat=${data.category}`}
              className="text-blue-800"
            >
              {data.category}
            </Link>
            <span>{format(data.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>
        <div className="hidden lg:block w-2/5">
          <Image
            alt="post-img"
            src={data.img || `/images/default_img.webp`}
            width={600}
            height={300}
            className="rounded-2xl w-[600px] h-[300px] object-cover"
          />
        </div>
      </div>
      <div className="flex">
        <div
          className="w-full min-w-[60%]"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
        {/* Content */}
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          {/* Menu */}
          <div className="px-4 h-max sticky top-8">
            <h1 className="mb-4 text-sm font-medium">Author</h1>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {data.user.img && (
                  <Image
                    alt="user-img"
                    src={data.user.img}
                    className="w-9 h-9 rounded-full object-cover"
                    width={36}
                    height={36}
                  />
                )}
                <Link
                  href={`/posts?author=${data.user.email}`}
                  className="text-blue-800"
                >
                  {data.user.username}
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                I write articles of web developments!
              </p>
              <div className="flex gap-2">
                <Link href="#">
                  <Image
                    alt="facebook"
                    width={30}
                    height={30}
                    src="/images/facebook.svg"
                  />
                </Link>
                <Link href="#">
                  <Image
                    alt="instagram"
                    width={30}
                    height={30}
                    src="/images/instagram.svg"
                  />
                </Link>
              </div>
            </div>
            <PostMenuActions post={data} />
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
      </div>
      <Comments postId={data._id} />
    </div>
  );
}
