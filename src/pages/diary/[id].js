import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DiaryDetail() {
  const router = useRouter();
  const { id } = router.query; 
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      // 일기 세부 정보를 가져오는 함수
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
          setDiary(data); // 일기 세부 정보 저장
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDiary();
    }
  }, [id]);

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
      <h1>{diary.title}</h1>
      <p>{diary.content}</p>
      <small>{new Date(diary.date).toLocaleDateString()}</small>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
};
