'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Post = {
  _id: string;
  slug?: string;
  isFeatured?: boolean;
  user: { username: string; _id: string; clerkUserId: string };
};

export default function PostMenuActions({ post }: { post: Post }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isFeatured, setIsFeatured] = useState(post.isFeatured || false); // State to track if the post is featured

  const queryClient = useQueryClient();
  const {
    data: savedPosts,
    isPending,
    error,
  } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/saved`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
  });

  const isAdmin = user?.publicMetadata?.role === 'admin';
  const isSaved = savedPosts?.some((p: string) => p === post._id);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success('Post deleted successfully!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Error deleting post');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/save`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Error saving post');
    },
  });

  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/feature`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      setIsFeatured((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ['post', post.slug] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Error featuring post');
    },
  });

  return (
    <div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
      {isPending ? (
        'Loading...'
      ) : error ? (
        'Saved post fetching failed!'
      ) : (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={() => saveMutation.mutate()}
        >
          <Star
            fill={isSaved ? '#ffd900' : 'none'}
            color={isSaved ? '#ffd900' : 'black'}
            size={22}
          />
          <span>{isSaved ? 'Unsave' : 'Save'} this Post</span>
        </div>
      )}
      {isAdmin && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={() => featureMutation.mutate()}
        >
          <span>{isFeatured ? 'Unfeature' : 'Feature'} this Post</span>
        </div>
      )}
      {user && (post.user.clerkUserId === user.id || isAdmin) && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={() => deleteMutation.mutate()}
        >
          <Trash2 color="black" size={22} />
          <span>Delete this Post</span>
          {deleteMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}
        </div>
      )}
    </div>
  );
}
