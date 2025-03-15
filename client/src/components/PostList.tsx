'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PostListItem from './PostListItem';
import { useSearchParams } from 'next/navigation';

const PostList = () => {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const searchParamsObj = Object.fromEntries(searchParams.entries());
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts`,
          {
            params: { page: pageIndex, ...searchParamsObj },
          },
        );
        if (pageIndex === 1) {
          setPosts(res.data.posts);
        } else if (res.data.posts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [pageIndex, searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && posts?.length > 0) {
          setPageIndex((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    return () => {
      if (lastPostRef.current) {
        observer.unobserve(lastPostRef.current);
      }
    };
  }, [posts, hasMore]);

  return (
    <div>
      {posts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
      {loading && <div>loading...</div>}
      {hasMore && <div className="h-[10px] trigger" ref={lastPostRef} />}
    </div>
  );
};

export default PostList;
