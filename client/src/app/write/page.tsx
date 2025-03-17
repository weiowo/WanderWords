'use client';

import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Upload from '@/components/Upload';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import Image from 'next/image';
import CircularProgressWithLabel from '@mui/material/CircularProgress';
import { CircleX } from 'lucide-react';
interface PostData {
  img: string;
  title: string;
  category: string;
  desc: string;
  content: string;
}

export default function Write() {
  const { isLoaded, isSignedIn } = useUser();
  const [cover, setCover] = useState<any>(null);
  const [img, setImg] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();
  const { getToken } = useAuth();

  const editorRef = useRef<TinyMCEEditor | null>(null);

  useEffect(() => {
    if (img && editorRef.current) {
      const editor = editorRef.current;
      editor.setContent(
        editor.getContent() + `<p><img src="${img.url}" /></p>`,
      );
    }
  }, [img]);

  const mutation: UseMutationResult<AxiosResponse, Error, PostData> =
    useMutation({
      mutationFn: async (newPost: PostData) => {
        const token = await getToken();
        return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, newPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      },
      onSuccess: (res) => {
        toast.success('Post has been created');
        router.push(`/single-post?slug=${res.data.slug}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data || 'Error creating post');
      },
    });

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="">You should login!</div>;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: PostData = {
      img: cover?.url || '',
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      desc: formData.get('desc') as string,
      content: editorRef.current?.getContent() || '',
    };
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-[1200px] h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <input
          className="text-4xl font-semibold bg-transparent outline-none text-[#7e7e7e]"
          type="text"
          placeholder="Title..."
          name="title"
        />
        <div className="flex items-center gap-4">
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <button className="cursor-pointer w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
              Add a cover image
            </button>
          </Upload>
          {progress >= 100 ? (
            cover?.url && (
              <div className="relative">
                <Image
                  src={cover?.url}
                  alt="preview"
                  className=""
                  width={80}
                  height={80}
                />
                <CircleX
                  fill="white"
                  onClick={() => setCover(null)}
                  className="cursor-pointer w-5 absolute top-[-10px] right-[-10px]"
                />
              </div>
            )
          ) : (
            <CircularProgressWithLabel
              variant="determinate"
              size={20}
              sx={{ color: '#ffa43c' }}
              value={progress}
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category:
          </label>
          <select
            name="category"
            id=""
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A Short Description"
        />
        <div className="flex flex-1 flex-col">
          <div className="flex flex gap-2 mr-2 mb-2 w-fit border-1 p-1 px-2 text-sm rounded-lg">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆 Add image to content
            </Upload>
          </div>
          <div className="w-full max-w-[1200px]">
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_MCE_KEY}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              init={{
                placeholder: 'Share your story...',
                height: 500,
                menubar: false,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'help',
                  'wordcount',
                  'pagebreak',
                  'visualchars',
                  'emoticons',
                ],
                toolbar:
                  'undo redo | styles | bold italic | forecolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat | help',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          </div>
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-[#a98f6f] text-white font-medium rounded-xl mb-10 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
        >
          {mutation.isPending ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
