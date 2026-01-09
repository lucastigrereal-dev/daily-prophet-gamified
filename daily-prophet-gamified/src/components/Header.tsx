'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-900">Daily Prophet</h1>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-3 flex justify-between items-center">
        <h1
          className="text-lg font-bold text-gray-900 cursor-pointer"
          onClick={() => router.push(user ? '/workflow' : '/')}
        >
          Daily Prophet
        </h1>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
