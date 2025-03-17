'use client';
import { useState, useEffect, useRef } from 'react';
import PostListItem from './PostListItem';
import { useSearchParams } from 'next/navigation';

export default function PostList() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  // Reset pageIndex and posts whenever searchParams change
  useEffect(() => {
    setPageIndex(1);
    setPosts([]); // Clear posts when searchParams change
    setHasMore(true); // Reset the "hasMore" state
  }, [searchParams]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const searchParamsObj = Object.fromEntries(searchParams.entries());
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        url.searchParams.append('page', pageIndex.toString());
        Object.entries(searchParamsObj).forEach(([key, value]) => {
          url.searchParams.append(key, value as string);
        });
        const res = await fetch(url.toString());
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (pageIndex === 1) {
          setPosts(data.posts); // Set posts to the fetched data if it's the first page
        } else if (data.posts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Append to previous posts if it's not the first page
        } else {
          setHasMore(false); // If no more posts, set hasMore to false
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [pageIndex]);

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
      {posts?.length > 0 ? (
        posts.map((post) => <PostListItem key={post._id} post={post} />)
      ) : (
        <div className="text-black">No posts found.</div>
      )}
      {loading && <div>loading...</div>}
      {hasMore && <div className="h-[10px] trigger" ref={lastPostRef} />}
    </div>
  );
}
