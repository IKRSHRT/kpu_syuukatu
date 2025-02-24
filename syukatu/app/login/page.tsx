'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './style.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg('メールアドレスまたはパスワードが正しくありません');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setErrorMsg('ログイン中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="login-card">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              ログイン
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              就活情報共有サービスへログイン
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={performLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="login-input mt-1 block w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="login-input mt-1 block w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-sm text-center text-red-600 font-medium" role="alert">
                {errorMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="login-button w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white focus:outline-none"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    ログイン中...
                  </span>
                ) : (
                  'ログイン'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link 
                href="/register" 
                className="login-link font-medium"
              >
                アカウントをお持ちでない方はこちら
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}