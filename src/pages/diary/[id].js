import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Flex } from '@radix-ui/themes';

export default function DiaryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(''); // 감정 분석 결과 상태
  const [analyzing, setAnalyzing] = useState(false); // 감정 분석 로딩 상태

  useEffect(() => {
    if (id) {
      const fetchDiary = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/diary/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error('일기를 불러오는 데 실패했습니다.');
          }

          const data = await res.json();
          setDiary(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDiary();
    }
  }, [id]);

  // 감정 분석 API 호출
  const handleAnalyzeSentiment = async () => {
    setAnalyzing(true); // 감정 분석 중 로딩 상태 활성화
    try {
      const res = await fetch(`/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text: diary.content }),
      });

      if (!res.ok) {
        throw new Error('감정 분석에 실패했습니다.');
      }

      const data = await res.json();
      setAnalysis(data.analysis); // 감정 분석 결과 저장
    } catch (error) {
      setError('감정 분석 중 오류가 발생했습니다.');
    } finally {
      setAnalyzing(false); // 감정 분석 완료 시 로딩 상태 해제
    }
  };

  if (loading) {
    return <p>일기를 불러오는 중...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!diary) {
    return <p>일기를 찾을 수 없습니다.</p>;
  }

  return (
    <Flex>
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => router.back()}>
        <img style={styles.backimg} src="/backward.svg"/>
      </button>

      <h1 style={styles.title}>{diary.title}</h1>
      <h2 style={styles.date}>{new Date(diary.date).toLocaleDateString()}</h2>
      <p style={styles.content}>
        {diary.content.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>
      {/* 감정 분석 버튼 */}
      <Button variant="soft" size="3" onClick={handleAnalyzeSentiment} disabled={analyzing}>
        {analyzing ? '분석 중...' : '감정 분석'}
      </Button>
      {/* <button style={styles.analyzeButton} onClick={handleAnalyzeSentiment} disabled={analyzing}>
        {analyzing ? '분석 중...' : '감정 분석'}
      </button> */}
      
      {/* 감정 분석 결과 */}
      {analysis && (
        <div style={styles.analysisResult}>
          <h3>감정 분석 결과</h3>
          <p>{analysis.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>
        </div>
      )}
    </div>
    </Flex>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '24px',
    background: 'none',
    border: 'none',
    color: '#0070f3',
    cursor: 'pointer',
  },
  backimg:{
    width: '3rem',
    height: '3rem',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  date: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '20px',
  },
  content: {
    textAlign: 'left',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  analyzeButton: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  analysisResult: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'black',
    borderRadius: '8px',
    textAlign: 'left',
  },
};
