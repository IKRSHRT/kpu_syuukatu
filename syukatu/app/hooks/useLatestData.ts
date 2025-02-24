import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface DataEntry {
  id: string;
  company_name: string;
  job_type?: string;
  test_type?: string;
  created_at: string;
  users_syukatu: {
    name: string;
  };
}

export default function useLatestData() {
  const [latestES, setLatestES] = useState<DataEntry[]>([]);
  const [latestInterviews, setLatestInterviews] = useState<DataEntry[]>([]);
  const [latestCodingTests, setLatestCodingTests] = useState<DataEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // ES情報の取得
      try {
        const { data: esData, error: esError } = await supabase
          .from('es_entries_syukatu')
          .select(`
            id,
            company_name,
            job_type,
            created_at,
            users_syukatu (
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (esError) {
          console.error('ES data fetch error:', esError);
        } else if (esData) {
          setLatestES(esData);
        }
      } catch (esErr) {
        console.error('ES try-catch error:', esErr);
      }

      // 面接情報の取得
      try {
        const { data: interviewData, error: interviewError } = await supabase
          .from('interviews_syukatu')
          .select(`
            id,
            company_name,
            job_type,
            created_at,
            users_syukatu (
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (interviewError) {
          console.error('Interview data fetch error:', interviewError);
        } else if (interviewData) {
          setLatestInterviews(interviewData);
        }
      } catch (interviewErr) {
        console.error('Interview try-catch error:', interviewErr);
      }

      // コーディングテスト情報の取得
      try {
        const { data: codingTestData, error: codingError } = await supabase
          .from('coding_tests_syukatu')  // テーブル名を正しいものに修正
          .select(`
            id,
            company_name,
            job_type,
            created_at,
            users_syukatu (
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (codingError) {
          console.error('Coding test data fetch error:', codingError);
          // テーブルがまだ存在しない場合は空の配列を設定
          setLatestCodingTests([]);
        } else if (codingTestData) {
          setLatestCodingTests(codingTestData);
        }
      } catch (codingErr) {
        console.error('Coding test try-catch error:', codingErr);
        setLatestCodingTests([]);
      }

    } catch (error) {
      console.error('Error fetching latest data:', error);
      setError('データの取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    latestES,
    latestInterviews,
    latestCodingTests,
    isLoading,
    error,
    fetchLatestData
  };
}