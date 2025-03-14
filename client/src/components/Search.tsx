'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { KeyboardEvent, useState } from 'react';

const Search: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', query.trim());

      if (pathname === '/posts') {
        router.replace(`/posts?${params.toString()}`);
      } else {
        router.push(`/posts?${params.toString()}`);
      }
    }
  };

  return (
    <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder="Search a post..."
        className="bg-transparent outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Search;
