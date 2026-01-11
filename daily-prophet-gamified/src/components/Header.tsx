'use client';

import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-3 flex justify-between items-center">
        <h1
          className="text-lg font-bold text-gray-900 cursor-pointer"
          onClick={() => router.push('/workflow')}
        >
          Daily Prophet
        </h1>
      </div>
    </header>
  );
}
