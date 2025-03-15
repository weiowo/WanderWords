'use client';

import { useAuth, useUser } from '@clerk/clerk-react';
import 'react-quill-new/dist/quill.snow.css';
// import ReactQuill from 'react-quill-new';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Upload from '@/components/Upload';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import Image from 'next/image';

interface PostData {
  img: string;
  title: string;
  category: string;
  desc: string;
  content: string;
}

// interface CoverImage {
//   filePath: string;
// }

// interface Media {
//   url: string;
// }

export default function Write() {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState<string>('');
  const [cover, setCover] = useState<any>(null);
  const [img, setImg] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();
  // const QuillEditor = ReactQuill as unknown as React.FC<any>;
  const { getToken } = useAuth();
  console.log('cover', cover);
  console.log('img', img);

  const editorRef = useRef<TinyMCEEditor | null>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  useEffect(() => {
    if (img && editorRef.current) {
      const editor = editorRef.current;
      editor.setContent(
        editor.getContent() + `<p><img src="${img.url}" /></p>`,
      );
    }
  }, [img]);

  useEffect(() => {
    if (video && editorRef.current) {
      const editor = editorRef.current;
      editor.setContent(
        editor.getContent() +
          `<p><iframe class="ql-video" src="${video.url}"></iframe></p>`,
      );
    }
  }, [video]);

  // useEffect(() => {
  //   if (img) {
  //     setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  //   }
  // }, [img]);

  // useEffect(() => {
  //   if (video) {
  //     setValue(
  //       (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`,
  //     );
  //   }
  // }, [video]);

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
      content: editorRef.current?.getContent() || '', // Get content from editorRef
    };
    console.log('data', data);
    mutation.mutate(data);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="cursor-pointer w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            Add a cover image
          </button>
        </Upload>
        {cover?.url && (
          <Image src={cover?.url} alt="preview" width={50} height={50} />
        )}
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
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload>
          </div>
          {/* <Editor
      apiKey='dkn2t8otuh47t8e3nz3cne9m9bhoyoz3zr5pu8py0w5zsygt'
      init={{
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
      }}
      initialValue="Welcome to TinyMCE!"
    /> */}
          {/* <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_MCE_KEY} // Get your API key from TinyMCE
      value={value}
      onEditorChange={(newContent) => setValue(newContent)}
      init={{
        height: 500,
        menubar: false,
        plugins: ['link', 'table', 'lists'],
        toolbar: 'undo redo | bold italic | link image | alignleft aligncenter alignright | numlist bullist',
      }}
    /> */}
          <button onClick={log}>Log editor content</button>

          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_MCE_KEY} // Get your API key from TinyMCE
            onInit={(_evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
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
                'code',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
          {/* <QuillEditor
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          /> */}
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
