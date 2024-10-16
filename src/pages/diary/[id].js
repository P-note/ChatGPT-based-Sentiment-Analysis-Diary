import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DiaryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태

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
      setAnalysis(data.analysis); // 감정 분석 결과 설정
      setModalOpen(true); // 모달 열기
    } catch (error) {
      setError('감정 분석 중 오류가 발생했습니다.');
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
    <div style={styles.container}>
      {/* 왼쪽 상단의 화살표 뒤로가기 버튼 */}
      <button style={styles.backButton} onClick={() => router.back()}>
        ←
      </button>

      <h1 style={styles.title}>{diary.title}</h1>
      <h2 style={styles.date}>{new Date(diary.date).toLocaleDateString()}</h2>

      <p style={styles.content}>{diary.content}</p>

      <button style={styles.analyzeButton} onClick={handleAnalyzeSentiment}>
        감정 분석
      </button>

      {/* 모달창 */}
      {modalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>감정 분석 결과</h2>
            <p>{analysis}</p>
            <button onClick={() => setModalOpen(false)} style={styles.closeButton}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin:'0.5rem',
  },
  date: {
    color: '#888',
    fontSize: '14px',
    margin:'1.5rem',
  },
  content: {
    textAlign: 'left',
    color: '#fff',
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#f53d3d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
