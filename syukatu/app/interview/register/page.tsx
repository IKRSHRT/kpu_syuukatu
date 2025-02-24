'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import './style.css';

export default function InterviewRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userProfile, setUserProfile] = useState<{ name: string; department: string } | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobType: '',
    graduationYear: '',
    interviewType: '',
    interviewDuration: '',
    interviewFormat: '',
    numOfInterviewers: '',
    questions: '',
    atmosphere: '',
    preparationMethods: '',
    advice: ''
  });

  const graduationYears = ['2025年卒', '2026年卒', '2027年卒'];
  const interviewTypes = ['1次面接', '2次面接', '3次面接', '最終面接', 'カジュアル面談'];
  const interviewFormats = ['対面', 'オンライン', 'ハイブリッド'];
  const durations = ['30分', '45分', '60分', '90分', '120分', '120分以上'];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('認証されていません');

      const { error } = await supabase.from('interviews_syukatu').insert([
        {
          user_id: user.id,
          company_name: formData.companyName,
          job_type: formData.jobType,
          graduation_year: formData.graduationYear,
          interview_type: formData.interviewType,
          interview_duration: formData.interviewDuration,
          interview_format: formData.interviewFormat,
          num_of_interviewers: parseInt(formData.numOfInterviewers) || 0,
          questions: formData.questions,
          atmosphere: formData.atmosphere,
          preparation_methods: formData.preparationMethods,
          advice: formData.advice
        }
      ]);

      if (error) throw error;

      router.push('/interview');
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

      <div className="interview-register-container">
        <div className="max-w-2xl mx-auto">
          <div className="interview-register-card">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold interview-title">
                面接情報登録
              </h1>
              <button
                type="button"
                onClick={() => router.back()}
                className="interview-back-button inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
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
                  className="interview-input mt-1 block w-full rounded-lg py-2 px-3"
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
                  className="interview-input mt-1 block w-full rounded-lg py-2 px-3"
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
                  className="interview-select mt-1 block w-full rounded-lg py-2 px-3"
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
                <label htmlFor="interviewType" className="form-label block text-sm font-medium required-label">
                  面接種別
                </label>
                <select
                  id="interviewType"
                  name="interviewType"
                  required
                  className="interview-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.interviewType}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {interviewTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="interviewFormat" className="form-label block text-sm font-medium required-label">
                  面接形式
                </label>
                <select
                  id="interviewFormat"
                  name="interviewFormat"
                  required
                  className="interview-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.interviewFormat}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {interviewFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="interviewDuration" className="form-label block text-sm font-medium required-label">
                  面接時間
                </label>
                <select
                  id="interviewDuration"
                  name="interviewDuration"
                  required
                  className="interview-select mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.interviewDuration}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="numOfInterviewers" className="form-label block text-sm font-medium required-label">
                  面接官の人数
                </label>
                <input
                  type="number"
                  id="numOfInterviewers"
                  name="numOfInterviewers"
                  required
                  min="1"
                  className="interview-input mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.numOfInterviewers}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="questions" className="form-label block text-sm font-medium required-label">
                  質問内容
                </label>
                <textarea
                  id="questions"
                  name="questions"
                  required
                  rows={4}
                  className="interview-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.questions}
                  onChange={handleChange}
                  placeholder="面接で聞かれた質問を記入してください"
                />
              </div>

              <div className="form-group">
                <label htmlFor="atmosphere" className="form-label block text-sm font-medium required-label">
                  面接の雰囲気
                </label>
                <textarea
                  id="atmosphere"
                  name="atmosphere"
                  required
                  rows={4}
                  className="interview-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.atmosphere}
                  onChange={handleChange}
                  placeholder="面接の雰囲気について記入してください"
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
                  rows={4}
                  className="interview-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.preparationMethods}
                  onChange={handleChange}
                  placeholder="面接対策として行ったことを記入してください"
                />
              </div>

              <div className="form-group">
                <label htmlFor="advice" className="form-label block text-sm font-medium">
                  アドバイス・補足
                </label>
                <textarea
                  id="advice"
                  name="advice"
                  rows={4}
                  className="interview-textarea mt-1 block w-full rounded-lg py-2 px-3"
                  value={formData.advice}
                  onChange={handleChange}
                  placeholder="後輩へのアドバイスや補足事項があれば記入してください"
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
                  className="interview-submit-button inline-flex justify-center py-3 px-6 rounded-lg text-sm font-medium text-white"
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