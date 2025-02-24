// /app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import LatestInfoTab from '@/components/LatestInfoTab';
import useLatestData from '@/hooks/useLatestData';
import './style.css';

interface UserProfile {
  id: string;
  name: string | null;
  department: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('es');
  
  // カスタムフックからデータ取得
  const { 
    latestES, 
    latestInterviews, 
    latestCodingTests,
    isLoading: dataLoading
  } = useLatestData();

  useEffect(() => {
    validateAuthAndLoadProfile();
  }, []);

  const validateAuthAndLoadProfile = async () => {
    try {
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

      const { data: profile, error: profileError } = await supabase
        .from('users_syukatu')
        .select('id, name, department')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('プロフィール取得エラー:', profileError.message);
        setShowProfileForm(true);
      } else if (profile) {
        setUserProfile(profile);
        setShowProfileForm(!profile.name || !profile.department);
      } else {
        setShowProfileForm(true);
      }
    } catch (error) {
      console.error('プロフィール読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('パスワードは8文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('パスワードが一致しません');
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) throw passwordError;

      const { data: profileData, error: profileError } = await supabase
        .from('users_syukatu')
        .insert([
          {
            id: user.id,
            email: user.email,
            name,
            department,
          }
        ])
        .select('id, name, department')
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setUserProfile(profileData);
      }

      setShowProfileForm(false);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      setErrorMsg('プロフィールの更新に失敗しました。もう一度お試しください。');
    }
  };

  if (loading || dataLoading) {
    return <LoadingState />;
  }

  if (showProfileForm) {
    return (
      <div className="dashboard-container flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            プロフィール登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            サービスを利用するために必要な情報を入力してください
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="profile-card">
            <form className="space-y-6" onSubmit={registerProfile}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  氏名
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="profile-input appearance-none block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  学部
                </label>
                <div className="mt-1">
                  <select
                    id="department"
                    name="department"
                    required
                    className="profile-select block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    <option value="情報学部">情報学部</option>
                    <option value="経営学部">経営学部</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="profile-input appearance-none block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">8文字以上で入力してください</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  パスワード（確認）
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="profile-input appearance-none block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-red-500 text-sm text-center font-medium">{errorMsg}</div>
              )}

              <div>
                <button
                  type="submit"
                  className="submit-button w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white"
                >
                  登録する
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header 
        userName={userProfile?.name} 
        userDepartment={userProfile?.department}
        userId={userProfile?.id}
      />

      <div className="dashboard-content max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="dashboard-welcome">
          <h1 className="text-2xl font-bold">こんにちは、{userProfile?.name}さん</h1>
          <p className="text-gray-600 mt-2">最新の就活情報が確認できます</p>
        </div>

        <div className="dashboard-tabs">
          <nav className="flex justify-center">
            <button
              onClick={() => setActiveTab('es')}
              className={`tab-button ${activeTab === 'es' ? 'tab-active' : ''}`}
            >
              最新のES情報
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`tab-button ${activeTab === 'interview' ? 'tab-active' : ''}`}
            >
              最新の面接情報
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`tab-button ${activeTab === 'coding' ? 'tab-active' : ''}`}
            >
              最新のコーディングテスト
            </button>
          </nav>
        </div>

        <div className="dashboard-latest">
          {activeTab === 'es' && (
            <LatestInfoTab
              title="最新のES情報"
              entries={latestES}
              registerPath="/es/register"
              viewPath="/es"
              isEmpty={latestES.length === 0}
              emptyMessage="まだES情報がありません"
              fieldToShow="job_type"
              hideUserProfile={true}
            />
          )}

          {activeTab === 'interview' && (
            <LatestInfoTab
              title="最新の面接情報"
              entries={latestInterviews}
              registerPath="/interview/register"
              viewPath="/interview"
              isEmpty={latestInterviews.length === 0}
              emptyMessage="まだ面接情報がありません"
              fieldToShow="job_type"
              hideUserProfile={true}
            />
          )}

          {activeTab === 'coding' && (
            <LatestInfoTab
              title="最新のコーディングテスト情報"
              entries={latestCodingTests}
              registerPath="/coding-test/register"
              viewPath="/coding-test"
              isEmpty={latestCodingTests.length === 0}
              emptyMessage="まだコーディングテスト情報がありません"
              fieldToShow="job_type"
              hideUserProfile={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}