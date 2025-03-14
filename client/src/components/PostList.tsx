'use client';
import PostListItem from './PostListItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'next/navigation'; // Use Next.js's useSearchParams

const fetchPosts = async (pageParam: any, searchParams: URLSearchParams) => {
  const searchParamsObj = Object.fromEntries(searchParams.entries()); // convert URLSearchParams to a plain object

  console.log(searchParamsObj);

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const searchParams = useSearchParams(); // Get searchParams from Next.js

  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ['posts', searchParams.toString()],
      queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length + 1 : undefined,
    });

  if (isFetching) return 'Loading...';

  if (error) return 'Something went wrong!';

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts...</h4>}
      endMessage={
        <p>
          <b>All posts loaded!</b>
        </p>
      }
    >
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;
