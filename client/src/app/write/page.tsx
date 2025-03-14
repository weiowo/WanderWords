'use client';

import { useAuth, useUser } from '@clerk/clerk-react';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Upload from "../components/Upload";

interface PostData {
  img: string;
  title: string;
  category: string;
  desc: string;
  content: string;
}

interface CoverImage {
  filePath: string;
}

interface Media {
  url: string;
}

export default function Write() {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState<string>('');
  const [cover, setCover] = useState<CoverImage | null>(null);
  const [img, setImg] = useState<Media | null>(null);
  const [video, setVideo] = useState<Media | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    if (img) {
      setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
    }
  }, [img]);

  useEffect(() => {
    if (video) {
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`,
      );
    }
  }, [video]);

  const mutation: UseMutationResult<AxiosResponse, Error, PostData> =
    useMutation({
      mutationFn: async (newPost: PostData) => {
        const token = await getToken();
        return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      },
      onSuccess: (res) => {
        toast.success('Post has been created');
        navigate(`/${res.data.slug}`);
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
      img: cover?.filePath || '',
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      desc: formData.get('desc') as string,
      content: value,
    };

    mutation.mutate(data);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        {/* <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            Add a cover image
          </button>
        </Upload> */}
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My Awesome Story"
          name="title"
        />
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
        <div className="flex flex-1 ">
          <div className="flex flex-col gap-2 mr-2">
            {/* <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload> */}
          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Loading...' : 'Send'}
        </button>
        {'Progress:' + progress}
      </form>
    </div>
  );
}
