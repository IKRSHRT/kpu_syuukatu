'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import './style.css';

export default function ESRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userProfile, setUserProfile] = useState<{ name: string; department: string } | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobType: '',
    graduationYear: '',
    esFormat: '',
    esTheme: '',
    importantPoints: '',
    preparationMethods: ''
  });

  const graduationYears = ['2025年卒', '2026年卒', '2027年卒'];
  const esFormats = ['履歴書の提出', 'フォームの回答'];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('認証されていません');

      const { error } = await supabase.from('es_entries_syukatu').insert([
        {
          user_id: user.id,
          company_name: formData.companyName,
          job_type: formData.jobType,
          graduation_year: formData.graduationYear,
          es_format: formData.esFormat,
          es_theme: formData.esTheme,
          important_points: formData.importantPoints,
          preparation_methods: formData.preparationMethods
        }
      ]);

      if (error) throw error;

      router.push('/es');
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

      <div className="es-register-container">
        <div className="max-w-2xl mx-auto">
          <div className="es-register-card">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold es-title">
                ES情報登録
              </h1>
              <button
                type="button"
                onClick={() => router.back()}
                className="es-back-button inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
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
                  className="es-input mt-1 block w-full rounded-lg py-2 px-3"
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
                  className="es-input mt-1 block w-full rounded-lg py-2 px-3"
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
                  className="es-select mt-1 block w-full rounded-lg py-2 px-3"
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
                <label htmlFor="esFormat" className="form-label block text-sm font-medium required-label">
                  ESの形式
                </label>
                <select
                  id="esFormat"
                  name="esFormat"
                  required
                  className="es-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.esFormat}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {esFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="esTheme" className="form-label block text-sm font-medium required-label">
                  ESの内容・テーマ
                </label>
                <textarea
                  id="esTheme"
                  name="esTheme"
                  required
                  className="es-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.esTheme}
                  onChange={handleChange}
                  placeholder="例: 学生時代に力を入れたこと、自己PR、志望動機など"
                />
              </div>

              <div className="form-group">
                <label htmlFor="importantPoints" className="form-label block text-sm font-medium required-label">
                  ESを書くときに注意したこと
                </label>
                <textarea
                  id="importantPoints"
                  name="importantPoints"
                  required
                  className="es-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.importantPoints}
                  onChange={handleChange}
                  placeholder="例: 結果と数値を具体的に記載、自分の強みを明確に表現など"
                />
              </div>

              <div className="form-group">
                <label htmlFor="preparationMethods" className="form-label block text-sm font-medium required-label">
                  ES対策で行ったこと
                </label>
                <textarea
                  id="preparationMethods"
                  name="preparationMethods"
                  required
                  className="es-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.preparationMethods}
                  onChange={handleChange}
                  placeholder="例: OB・OG訪問で業界研究、インターンシップ参加、自己分析ワークなど"
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
                  className="es-submit-button inline-flex justify-center py-3 px-6 rounded-lg text-sm font-medium text-white"
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