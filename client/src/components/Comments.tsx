import axios, { AxiosResponse } from 'axios';
import Comment from './Comment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

// Define types for the comment and API response
interface CommentType {
  _id: string;
  desc: string;
  createdAt: string;
  user: {
    img: string;
    username: string;
  };
}

// interface CommentsResponse {
//   comments: CommentType[];
// }

interface NewComment {
  desc: string;
}

interface CommentsProps {
  postId: string;
}

const fetchComments = async (postId: string): Promise<CommentType[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`,
  );
  return res.data;
};

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const { isLoading, error, data } = useQuery<CommentType[], Error>({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation<AxiosResponse, Error, NewComment>({
    mutationFn: async (newComment: NewComment) => {
      const token = await getToken();
      return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Error posting comment');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const data: NewComment = {
      desc: formData.get('desc') as string,
    };

    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl"
        />
        <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
          Send
        </button>
      </form>
      {isLoading ? (
        'Loading...'
      ) : error ? (
        'Error loading comments!'
      ) : (
        <>
          {mutation.isPending && (
            <Comment
              postId=""
              comment={{
                _id: '',
                desc: `${mutation.variables?.desc} (Sending...)`,
                createdAt: new Date().toISOString(),
                user: {
                  img: user?.imageUrl || '',
                  username: user?.username || '',
                },
              }}
            />
          )}

          {data?.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
