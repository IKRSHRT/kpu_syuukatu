// app/register/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './style.css';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return email.endsWith('大学アドレス');
  };

  const initiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!validateEmail(email)) {
      setErrorMsg('開志専門職大学のメールアドレスのみ登録可能です');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      setErrorMsg('登録処理中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="register-container flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="success-card">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              確認メールを送信しました
            </h2>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p className="font-medium success-text">
                入力したメールアドレスに確認メールを送信しました。
              </p>
              <p className="mt-3">
                メール内のリンクをクリックして、アカウントを有効化してください。
              </p>
              <p className="mt-2">
                メールが届かない場合は、迷惑メールフォルダもご確認ください。
              </p>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="register-link font-medium"
              >
                ログインページへ戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="register-card">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              アカウント登録
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              開志専門職大学のメールアドレスで登録してください
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={initiateSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                大学メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                className="register-input mt-1 block w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {errorMsg && (
              <div className="text-red-500 text-sm text-center font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="register-button w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white focus:outline-none"
              >
                {isSubmitting ? (
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    処理中...
                  </span>
                ) : (
                  '登録する'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="register-link font-medium"
            >
              すでにアカウントをお持ちの方はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}