'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import './style.css';

interface InterviewEntry {
  id: string;
  company_name: string;
  job_type: string;
  graduation_year: string;
  interview_type: string;
  interview_duration: string;
  interview_format: string;
  num_of_interviewers: number;
  questions: string;
  atmosphere: string;
  preparation_methods: string;
  advice: string;
  created_at: string;
  users_syukatu: {
    id: string;
    name: string;
    department: string;
  };
}

export default function InterviewListPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<InterviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [userProfile, setUserProfile] = useState<{ name: string; department: string } | null>(null);

  useEffect(() => {
    const loadUserAndEntries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('users_syukatu')
          .select('name, department')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
        }

        const { data, error } = await supabase
          .from('interviews_syukatu')
          .select(`
            *,
            users_syukatu (
              id,
              name,
              department
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndEntries();
  }, [router]);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.job_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || entry.interview_type === selectedType;
    const matchesYear = !selectedYear || entry.graduation_year === selectedYear;
    
    return matchesSearch && matchesType && matchesYear;
  });

  const uniqueYears = Array.from(new Set(entries.map(entry => entry.graduation_year))).sort();
  const interviewTypes = ['1次面接', '2次面接', '3次面接', '最終面接', 'カジュアル面談'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <Header
        userName={userProfile?.name}
        userDepartment={userProfile?.department}
      />

      <div className="interview-list-container">
        <div className="content-wrapper">
          <div className="header-section">
            <h1 className="interview-list-title">面接情報一覧</h1>
          </div>

          <div className="interview-filter-container">
            <input
              type="text"
              placeholder="会社名または職種で検索"
              className="interview-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="interview-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">面接種別で絞り込み</option>
              {interviewTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              className="interview-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">卒業年度で絞り込み</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="empty-state">
              <p>
                {entries.length === 0 
                  ? 'まだ面接情報が登録されていません' 
                  : '条件に一致する面接情報が見つかりませんでした'}
              </p>
            </div>
          ) : (
            <div className="interview-grid">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="interview-card">
                  <div className="interview-card-content">
                    <div className="card-header">
                      <h3 className="card-title">{entry.company_name}</h3>
                      <div className="badge-container">
                        <span className="interview-year-badge">{entry.graduation_year}</span>
                        <span className="interview-type-badge">{entry.interview_type}</span>
                      </div>
                    </div>
                    
                    <div className="card-subtitle">
                      {entry.job_type} | {entry.users_syukatu.name}（{entry.users_syukatu.department}）
                    </div>
                    
                    <div className="profile-link">
                      <Link href={`/user/${entry.users_syukatu.id}`} className="user-link">
                        投稿者のプロフィールを見る
                      </Link>
                    </div>

                    <div className="card-section">
                      <h4 className="interview-section-title">面接形式</h4>
                      <p className="interview-section-content">
                        {entry.interview_format} / {entry.interview_duration} / 面接官{entry.num_of_interviewers}名
                      </p>
                    </div>

                    <div className="card-section">
                      <h4 className="interview-section-title">質問内容</h4>
                      <p className="interview-section-content">{entry.questions}</p>
                    </div>

                    <div className="card-section">
                      <h4 className="interview-section-title">面接の雰囲気</h4>
                      <p className="interview-section-content">{entry.atmosphere}</p>
                    </div>

                    <div className="card-section">
                      <h4 className="interview-section-title">準備方法・対策</h4>
                      <p className="interview-section-content">{entry.preparation_methods}</p>
                    </div>

                    {entry.advice && (
                      <div className="card-section">
                        <h4 className="interview-section-title">アドバイス・補足</h4>
                        <p className="interview-section-content">{entry.advice}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="interview-card-footer">
                    登録日: {formatDate(entry.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/interview/register"
          className="interview-register-button"
        >
          新規登録
        </Link>
      </div>
    </>
  );
}
