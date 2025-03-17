import Link from 'next/link';
import MainCategories from '@/components/MainCategories';
import FeaturedPosts from '@/components/FeaturedPosts';
import PostList from '@/components/PostList';

export default function Home() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* BREADCRUMB */}
      {/* <div className="flex gap-4">
        <Link href="/">Home</Link>
        <span>•</span>
        <span className="text-blue-800">Blogs and Articles</span>
      </div> */}
      {/* INTRODUCTION */}
      <div className="flex items-center justify-between">
        {/* Titles */}
        <div>
          <h1 className="text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold">
            Unleash Your Creativity, <br /> Share Your Story
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Inspiring Stories and Insights on Travel, Tech, and Life’s
            Adventures
          </p>
        </div>
        <Link href="/write" className="hidden md:block relative">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            aria-label="Write and share your story"
            className="text-lg tracking-widest animate-spin animatedButton"
          >
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea •
              </textPath>
            </text>
          </svg>
          <button
            className="cursor-pointer absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-[#ff981b] rounded-full flex items-center justify-center"
            aria-label="Write your story"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="60"
              height="60"
              fill="none"
              stroke="black"
              strokeWidth="3"
            >
              <line x1="6" y1="18" x2="18" y2="6" />
              <polyline points="9 6 18 6 18 15" />
            </svg>
          </button>
        </Link>
      </div>
      <MainCategories />
      <div>featured</div>
      <FeaturedPosts />
      <div>
        <h1 className="my-8 text-2xl text-gray-600">Recent Posts</h1>
        <PostList />
      </div>
    </div>
  );
}
