declare module 'react-infinite-scroll-component' {
  import React from 'react';

  interface InfiniteScrollProps {
    dataLength: number;
    next: () => void;
    hasMore: boolean;
    loader: React.ReactNode;
    endMessage: React.ReactNode;
    children: React.ReactNode;
  }

  const InfiniteScroll: React.ComponentType<InfiniteScrollProps>;

  export default InfiniteScroll;
}
