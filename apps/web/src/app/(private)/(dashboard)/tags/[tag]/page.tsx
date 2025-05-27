'use client';

import { usePathname } from 'next/navigation';

export default function SearchTagPage() {
  const pathname = usePathname();

  return <main className="flex flex-col gap-4 p-4">{pathname}</main>;
}
