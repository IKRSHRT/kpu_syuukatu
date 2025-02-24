//coding-test/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import './style.css';

export default function CodingTestRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userProfile, setUserProfile] = useState<{ name: string; department: string } | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobType: '',
    graduationYear: '',
    testDifficulty: '',
    testFormat: '',
    testDuration: '',
    programmingLanguages: [] as string[],
    testContents: '',
    preparationMethods: '',
    advice: ''
  });

  const difficultyLevels = ['易しい', '普通', '難しい', 'とても難しい'];
  const testFormats = ['コーディング形式', '選択形式', '記述形式', '複合形式'];
  const durations = ['30分', '45分', '60分', '90分', '120分', '120分以上'];
  const programmingLanguageOptions = [
    'Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'C#',
    'Ruby', 'Go', 'Swift', 'Kotlin', 'PHP', 'その他'
  ];
  const graduationYears = ['2025年卒', '2026年卒', '2027年卒'];

  useEffect(() => {
    const loadUserProfile = async () => {
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
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadUserProfile();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (language: string) => {
    setFormData(prev => ({
      ...prev,
      programmingLanguages: prev.programmingLanguages.includes(language)
        ? prev.programmingLanguages.filter(l => l !== language)
        : [...prev.programmingLanguages, language]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('認証されていません');

      const { error } = await supabase.from('coding_tests_syukatu').insert([
        {
          user_id: user.id,
          company_name: formData.companyName,
          job_type: formData.jobType,
          graduation_year: formData.graduationYear,
          test_difficulty: formData.testDifficulty,
          test_format: formData.testFormat,
          test_duration: formData.testDuration,
          programming_languages: formData.programmingLanguages,
          test_contents: formData.testContents,
          preparation_methods: formData.preparationMethods,
          advice: formData.advice
        }
      ]);

      if (error) throw error;

      router.push('/coding-test');
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header 
        userName={userProfile?.name} 
        userDepartment={userProfile?.department}
      />

      <div className="coding-test-register-container">
        <div className="max-w-2xl mx-auto">
          <div className="coding-test-register-card">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold coding-test-title">
                コーディングテスト情報登録
              </h1>
              <button
                type="button"
                onClick={() => router.back()}
                className="coding-test-back-button inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
              >
                戻る
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="companyName" className="form-label block text-sm font-medium required-label">
                  会社名
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  className="coding-test-input mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="jobType" className="form-label block text-sm font-medium required-label">
                  選考職種
                </label>
                <input
                  type="text"
                  id="jobType"
                  name="jobType"
                  required
                  className="coding-test-input mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.jobType}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="graduationYear" className="form-label block text-sm font-medium required-label">
                  卒業年度
                </label>
                <select
                  id="graduationYear"
                  name="graduationYear"
                  required
                  className="coding-test-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.graduationYear}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="testDifficulty" className="form-label block text-sm font-medium required-label">
                  テストの難易度
                </label>
                <select
                  id="testDifficulty"
                  name="testDifficulty"
                  required
                  className="coding-test-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.testDifficulty}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="testFormat" className="form-label block text-sm font-medium required-label">
                  テストの形式
                </label>
                <select
                  id="testFormat"
                  name="testFormat"
                  required
                  className="coding-test-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.testFormat}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {testFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="testDuration" className="form-label block text-sm font-medium required-label">
                  テストの所要時間
                </label>
                <select
                  id="testDuration"
                  name="testDuration"
                  required
                  className="coding-test-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.testDuration}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium required-label">
                  使用可能なプログラミング言語
                </label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {programmingLanguageOptions.map((language) => (
                    <label key={language} className="coding-test-checkbox-label">
                      <input
                        type="checkbox"
                        className="coding-test-checkbox"
                        checked={formData.programmingLanguages.includes(language)}
                        onChange={() => handleLanguageChange(language)}
                      />
                      <span className="ml-2">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="testContents" className="form-label block text-sm font-medium required-label">
                  テストの内容
                </label>
                <textarea
                  id="testContents"
                  name="testContents"
                  required
                  className="coding-test-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.testContents}
                  onChange={handleChange}
                  placeholder="出題された問題の種類や内容について具体的に記述してください"
                />
              </div>

              <div className="form-group">
                <label htmlFor="preparationMethods" className="form-label block text-sm font-medium required-label">
                  準備方法・対策
                </label>
                <textarea
                  id="preparationMethods"
                  name="preparationMethods"
                  required
                  className="coding-test-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.preparationMethods}
                  onChange={handleChange}
                  placeholder="どのように準備・対策を行ったか記述してください"
                />
              </div>

              <div className="form-group">
                <label htmlFor="advice" className="form-label block text-sm font-medium">
                  アドバイス・補足
                </label>
                <textarea
                  id="advice"
                  name="advice"
                  className="coding-test-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.advice}
                  onChange={handleChange}
                  placeholder="後輩へのアドバイスや補足事項があれば記述してください"
                />
              </div>

              {errorMsg && (
                <div className="text-red-600 text-sm text-center font-medium p-2 bg-red-50 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="coding-test-submit-button inline-flex justify-center py-3 px-6 rounded-lg text-sm font-medium text-white"
                >
                  {isSubmitting ? '登録中...' : '登録する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}