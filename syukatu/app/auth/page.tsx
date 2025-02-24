/* app/auth/page.tsx */

'use client';

import Link from 'next/link';
import './style.css';

export default function AuthPage() {
  return (
    <div className="auth-container flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="auth-card">
          <div className="space-y-6">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                アカウント作成・ログイン
              </h2>
              <p className="mt-3 text-center text-sm text-gray-600">
                開志専門職大学の学生専用プラットフォーム
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Link
                  href="/register"
                  className="auth-button-primary w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none"
                >
                  新規登録
                </Link>
              </div>
              
              <div>
                <Link
                  href="/login"
                  className="auth-button-secondary w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium bg-white focus:outline-none"
                >
                  ログイン
                </Link>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/"
                className="back-link font-medium hover:underline"
              >
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}