// app/page.tsx

'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              開志専門職大学
              <span className="block text-[#5AB9C1] mt-2">就活情報共有プラットフォーム</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:text-xl md:max-w-4xl leading-relaxed">
              ESや面接、コーディングテストの情報を共有して、より良い就職活動を実現しましょう。
            </p>
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-6">
                <Link
                  href="/auth"
                  className="primary-button flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white md:py-4 md:text-lg md:px-10"
                >
                  はじめる
                </Link>
                <Link
                  href="/about"
                  className="secondary-button flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg bg-white md:py-4 md:text-lg md:px-10"
                >
                  詳しく見る
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "ES対策",
                  description: "実際に通過したESの内容や、評価のポイントを共有することができます。",
                  icon: (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  )
                },
                {
                  title: "コーディングテスト",
                  description: "出題された問題の傾向や難易度、対策方法を共有できます。",
                  icon: (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                    />
                  )
                },
                {
                  title: "面接情報",
                  description: "実際の面接での質問内容や、回答のポイントを共有できます。",
                  icon: (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" 
                    />
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card pt-6">
                  <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-sm">
                    <div className="-mt-6">
                      <div 
                        className="inline-flex items-center justify-center p-3 rounded-lg shadow-md"
                        style={{ 
                          background: index % 2 === 0 ? '#5AB9C1' : '#ed8218'
                        }}
                      >
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {feature.icon}
                        </svg>
                      </div>
                      <h3 className="mt-8 text-xl font-semibold text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}