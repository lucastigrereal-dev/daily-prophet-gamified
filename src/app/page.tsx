'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Daily Prophet Gamified</h1>
      <div className="space-y-3">
        <button
          onClick={() => router.push('/workflow')}
          className="w-full py-4 bg-blue-500 text-white rounded-lg text-lg"
        >
          Workflows em Andamento
        </button>
        <button
          onClick={() => router.push('/historico')}
          className="w-full py-4 bg-green-500 text-white rounded-lg text-lg"
        >
          Historico
        </button>
      </div>
    </div>
  );
}
