'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Search from './Search';

const SideMenu = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = useSearchParams().get('sort');
  const cat = useSearchParams().get('cat');
  const currentPath = usePathname();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sort !== e.target.value) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', e.target.value);
      router.replace(`${currentPath}?${params.toString()}`);
    }
  };

  // const handleCategoryChange = (category: string) => {
  //   if (cat !== category) {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set('cat', category);
  //     router.replace(`${currentPath}?${params.toString()}`);
  //   }
  // };

  const handleCategoryChange = (category: string) => {
    if (cat !== category) {
      // Create new params object instead of modifying existing one
      const params = new URLSearchParams();

      // Only preserve essential parameters
      params.set('cat', category);

      // Preserve other important params if needed (like search or sort)
      const sort = searchParams.get('sort');
      if (sort) {
        params.set('sort', sort);
      }

      const search = searchParams.get('search');
      if (search) {
        params.set('search', search);
      }

      // Replace URL with clean parameters
      router.replace(`${currentPath}?${params.toString()}`);
    }
  };

  return (
    <div className="px-4 h-max sticky top-8">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Newest
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Most Popular
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Trending
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange('general')}
        >
          All
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange('web-design')}
        >
          Web Design
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange('development')}
        >
          Development
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange('databases')}
        >
          Databases
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange('seo')}
        >
          Search Engines
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange('marketing')}
        >
          Marketing
        </span>
      </div>
    </div>
  );
};

export default SideMenu;
