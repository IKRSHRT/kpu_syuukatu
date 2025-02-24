'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import './style.css';

interface CodingTestEntry {
  id: string;
  company_name: string;
  job_type: string;
  graduation_year: string;
  test_difficulty: string;
  test_format: string;
  test_duration: string;
  programming_languages: string[];
  test_contents: string;
  preparation_methods: string;
  advice: string;
  created_at: string;
  users_syukatu: {
    id: string;
    name: string;
    department: string;
  };
}

export default function CodingTestListPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<CodingTestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
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
          .from('coding_tests_syukatu')
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
    const matchesDifficulty = !selectedDifficulty || entry.test_difficulty === selectedDifficulty;
    const matchesYear = !selectedYear || entry.graduation_year === selectedYear;
    return matchesSearch && matchesDifficulty && matchesYear;
  });

  const uniqueYears = Array.from(new Set(entries.map(entry => entry.graduation_year))).sort();
  const difficultyLevels = ['易しい', '普通', '難しい', 'とても難しい'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'とても難しい': return 'coding-test-difficulty-very-hard';
      case '難しい': return 'coding-test-difficulty-hard';
      case '普通': return 'coding-test-difficulty-medium';
      case '易しい': return 'coding-test-difficulty-easy';
      default: return 'coding-test-difficulty-medium';
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <Header userName={userProfile?.name} userDepartment={userProfile?.department} />
      <div className="coding-test-list-container">
        <div className="content-wrapper">
          <div className="header-section">
            <h1 className="coding-test-list-title">コーディングテスト情報一覧</h1>
          </div>
          <div className="coding-test-filter-container">
            <input
              type="text"
              placeholder="会社名または職種で検索"
              className="coding-test-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="coding-test-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">難易度で絞り込み</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <select
              className="coding-test-select"
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
                  ? 'まだコーディングテストの情報が登録されていません' 
                  : '条件に一致する情報が見つかりませんでした'}
              </p>
            </div>
          ) : (
            <div className="coding-test-grid">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="coding-test-card">
                  <div className="coding-test-card-content">
                    <div className="card-header">
                      <h3 className="card-title">{entry.company_name}</h3>
                      <div className="badge-container">
                        <span className="coding-test-year-badge">{entry.graduation_year}</span>
                        <span className={`coding-test-difficulty-badge ${getDifficultyColor(entry.test_difficulty)}`}>
                          {entry.test_difficulty}
                        </span>
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
                      <h4 className="coding-test-section-title">テスト形式</h4>
                      <p className="coding-test-section-content">{entry.test_format}</p>
                    </div>
                    <div className="card-section">
                      <h4 className="coding-test-section-title">所要時間</h4>
                      <p className="coding-test-section-content">{entry.test_duration}</p>
                    </div>
                    <div className="card-section">
                      <h4 className="coding-test-section-title">使用可能言語</h4>
                      <div className="language-tags">
                        {entry.programming_languages.map((lang) => (
                          <span key={lang} className="coding-test-language-tag">{lang}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-section">
                      <h4 className="coding-test-section-title">テスト内容</h4>
                      <p className="coding-test-section-content">{entry.test_contents}</p>
                    </div>
                    <div className="card-section">
                      <h4 className="coding-test-section-title">準備方法・対策</h4>
                      <p className="coding-test-section-content">{entry.preparation_methods}</p>
                    </div>
                    {entry.advice && (
                      <div className="card-section">
                        <h4 className="coding-test-section-title">アドバイス・補足</h4>
                        <p className="coding-test-section-content">{entry.advice}</p>
                      </div>
                    )}
                  </div>
                  <div className="coding-test-card-footer">
                    登録日: {formatDate(entry.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link href="/coding-test/register" className="coding-test-register-button">
          新規登録
        </Link>
      </div>
    </>
  );
}
