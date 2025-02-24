// /app/user/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import Link from 'next/link';
import './style.css';

interface UserProfile {
  id: string;
  name: string | null;
  department: string | null;
  email: string | null;
}

interface UserSubmission {
  id: string;
  company_name: string;
  job_type: string;
  created_at: string;
  type: 'es' | 'interview' | 'coding';
}

// ダイナミックルートのパラメータの型を定義
interface ProfileParams {
  id: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams<ProfileParams>();
  
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'es' | 'interview' | 'coding'>('es');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 画面URLからIDを取得
        const pathSegments = window.location.pathname.split('/');
        const pathUserId = pathSegments[pathSegments.length - 1];
        
        // パラメータからのIDかパスからのIDを使用
        const targetUserId = typeof params?.id === 'string' ? params.id : pathUserId;
        
        if (!targetUserId || targetUserId === 'undefined' || targetUserId === '[id]') {
          console.error('有効なユーザーIDがありません');
          setError('ユーザーIDが見つかりませんでした。URLを確認してください。');
          setIsLoading(false);
          return;
        }

        // ログイン中のユーザー情報を取得
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('認証エラー:', authError.message);
          router.push('/login');
          return;
        }
        
        if (!user) {
          router.push('/login');
          return;
        }

        // 現在のユーザープロフィールを取得
        const { data: currentProfile, error: currentProfileError } = await supabase
          .from('users_syukatu')
          .select('id, name, department, email')
          .eq('id', user.id)
          .single();

        if (currentProfileError) {
          console.error('現在のユーザー情報取得エラー:', currentProfileError.message);
        } else {
          setCurrentUserProfile(currentProfile);
        }

        // 表示対象のユーザープロフィールを取得
        const { data: targetProfile, error: targetProfileError } = await supabase
          .from('users_syukatu')
          .select('id, name, department, email')
          .eq('id', targetUserId)
          .single();

        if (targetProfileError) {
          console.error('プロフィール取得エラー:', targetProfileError.message);
          setError(`ユーザー情報の取得に失敗しました。(ID: ${targetUserId})`);
          setIsLoading(false);
          return;
        }

        if (!targetProfile) {
          setError('指定されたユーザーが見つかりません');
          setIsLoading(false);
          return;
        }

        setUserProfile(targetProfile);

        // ユーザーの投稿を取得
        await fetchSubmissions(targetUserId);
        
      } catch (error) {
        if (error instanceof Error) {
          console.error('データ取得エラー:', error.message);
          setError(`データの読み込み中にエラーが発生しました: ${error.message}`);
        } else {
          console.error('不明なエラーが発生しました:', error);
          setError('不明なエラーが発生しました');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params, router]);

  const fetchSubmissions = async (userId: string) => {
    try {
      // ES情報の取得
      const { data: esData, error: esError } = await supabase
        .from('es_entries_syukatu')
        .select('id, company_name, job_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (esError) {
        console.error('ES情報取得エラー:', esError.message);
      }

      // 面接情報の取得
      const { data: interviewData, error: interviewError } = await supabase
        .from('interviews_syukatu')
        .select('id, company_name, job_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (interviewError) {
        console.error('面接情報取得エラー:', interviewError.message);
      }

      // コーディングテスト情報の取得
      const { data: codingData, error: codingError } = await supabase
        .from('coding_tests_syukatu')
        .select('id, company_name, job_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (codingError) {
        console.error('コーディングテスト情報取得エラー:', codingError.message);
      }

      // 結合してタイプを追加
      const submissions: UserSubmission[] = [
        ...(esData || []).map(item => ({ ...item, type: 'es' as const })),
        ...(interviewData || []).map(item => ({ ...item, type: 'interview' as const })),
        ...(codingData || []).map(item => ({ ...item, type: 'coding' as const }))
      ];

      // 日付順にソート
      submissions.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setUserSubmissions(submissions);
    } catch (error) {
      console.error('ユーザー投稿取得エラー:', error);
      // エラーがあっても空の配列を設定して表示だけはできるようにする
      setUserSubmissions([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const getSubmissionLink = (submission: UserSubmission) => {
    switch (submission.type) {
      case 'es':
        return `/es/${submission.id}`;
      case 'interview':
        return `/interview/${submission.id}`;
      case 'coding':
        return `/coding-test/${submission.id}`;
    }
  };

  const getSubmissionTypeName = (type: 'es' | 'interview' | 'coding') => {
    switch (type) {
      case 'es':
        return 'ES';
      case 'interview':
        return '面接';
      case 'coding':
        return 'コーディングテスト';
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <>
        <Header
          userName={currentUserProfile?.name || null}
          userDepartment={currentUserProfile?.department || null}
          userId={currentUserProfile?.id || null}
        />
        <div className="user-profile-container">
          <div className="max-w-5xl mx-auto">
            <div className="error-message">
              <p>{error}</p>
              <div className="mt-4">
                <Link href="/dashboard" className="back-link">
                  ダッシュボードに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        userName={currentUserProfile?.name || null}
        userDepartment={currentUserProfile?.department || null}
        userId={currentUserProfile?.id || null}
      />

      <div className="user-profile-container">
        <div className="max-w-5xl mx-auto">
          <div className="user-profile-card">
            <div className="user-profile-header">
              <div className="user-avatar">
                {userProfile?.name?.[0] || '?'}
              </div>
              <div className="user-info">
                <h1 className="user-name">{userProfile?.name || 'Unknown User'}</h1>
                <p className="user-department">{userProfile?.department || 'No department'}</p>
              </div>
            </div>

            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-value">{userSubmissions.filter(s => s.type === 'es').length}</span>
                <span className="stat-label">ES投稿</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userSubmissions.filter(s => s.type === 'interview').length}</span>
                <span className="stat-label">面接情報</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userSubmissions.filter(s => s.type === 'coding').length}</span>
                <span className="stat-label">コーディングテスト</span>
              </div>
            </div>

            <div className="user-submissions">
              <div className="submission-tabs">
                <button
                  onClick={() => setActiveTab('es')}
                  className={`tab-button ${activeTab === 'es' ? 'active-tab' : ''}`}
                >ES
                </button>
                <button
                  onClick={() => setActiveTab('interview')}
                  className={`tab-button ${activeTab === 'interview' ? 'active-tab' : ''}`}
                >
                  面接
                </button>
                <button
                  onClick={() => setActiveTab('coding')}
                  className={`tab-button ${activeTab === 'coding' ? 'active-tab' : ''}`}
                >
                  コーディングテスト
                </button>
              </div>

              <div className="submission-list">
                {userSubmissions.filter(s => s.type === activeTab).length === 0 ? (
                  <div className="empty-submissions">
                    <p>まだ{getSubmissionTypeName(activeTab)}情報の投稿がありません</p>
                  </div>
                ) : (
                  userSubmissions
                    .filter(s => s.type === activeTab)
                    .map(submission => (
                      <Link
                        href={getSubmissionLink(submission)}
                        key={`${submission.type}-${submission.id}`}
                        className="submission-item"
                      >
                        <div className="submission-content">
                          <h3 className="submission-company">{submission.company_name}</h3>
                          <p className="submission-job">{submission.job_type}</p>
                        </div>
                        <div className="submission-meta">
                          <span className="submission-date">{formatDate(submission.created_at)}</span>
                          <span className={`submission-type ${submission.type}`}>
                            {getSubmissionTypeName(submission.type)}
                          </span>
                        </div>
                      </Link>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}