'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';

  return (
    <div>
      <h1 className="text-2xl font-bold">Search Page</h1>
      <p>This is the search page content.</p>
      <p>Search Params: {search}</p>
    </div>
  );
}
