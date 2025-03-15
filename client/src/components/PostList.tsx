'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostListItem from './PostListItem';
import { useSearchParams } from 'next/navigation';

const PostList = () => {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  console.log('posts', posts);

  const fetchPosts = useCallback(async () => {
    try {
      const searchParamsObj = Object.fromEntries(searchParams.entries());
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        params: { page, limit: 1, ...searchParamsObj },
      });

      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      setHasMore(res.data.hasMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [page, searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => {
        setPage((prevPage) => prevPage + 1);
      }}
      hasMore={hasMore}
      loader={<h4>Loading more posts...</h4>}
      endMessage={
        <p>
          <b>All posts loaded!</b>
        </p>
      }
    >
      {posts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;
