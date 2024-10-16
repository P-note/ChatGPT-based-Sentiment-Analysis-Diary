import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/dashboard.module.css';

export default function Dashboard() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDiaries, setSelectedDiaries] = useState([]); 
  const [analysis, setAnalysis] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDiaries = async () => {
      try {
        const res = await fetch('/api/diary/list', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('일기 목록을 불러오는 데 실패했습니다.');
        }

        const data = await res.json();
        setDiaries(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleNewDiary = () => {
    router.push('/diary/create');
  };

  const handleDiaryClick = (id) => {
    router.push(`/diary/${id}`); //
  };

  const handleSelectDiary = (id) => {
    setSelectedDiaries((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((diaryId) => diaryId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAnalyzeSelectedDiaries = async () => {
    if (selectedDiaries.length === 0) {
      alert('분석할 일기를 선택하세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/analyzeMultiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ diaryIds: selectedDiaries }),
      });

      if (!res.ok) {
        throw new Error('감정 분석에 실패했습니다.');
      }

      const data = await res.json();
      setAnalysis(data.analysis); 
      setModalOpen(true); 
    } catch (error) {
      setError('감정 분석 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>대시보드</h1>
        <div>
          <button className={styles.button} onClick={handleNewDiary}>
            새 일기 작성
          </button>
          <button className={styles.analyzeButton} onClick={handleAnalyzeSelectedDiaries}>
            감정 분석
          </button>
        </div>
      </div>

      {loading ? (
        <p className={styles.notification}>일기 목록을 불러오는 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : diaries.length === 0 ? (
        <p>작성된 일기가 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {diaries.map((diary) => (
            <li key={diary._id} className={styles.listItem}>
              <input
                type="checkbox"
                checked={selectedDiaries.includes(diary._id)}
                onChange={() => handleSelectDiary(diary._id)}
                className={styles.checkbox}
              />
              <div className={styles.diaryContent} onClick={() => handleDiaryClick(diary._id)}>
                <h2 className={styles.title}>{diary.title}</h2>
                <p className={styles.content}>
                  {diary.content.substring(0, 100)}...</p>
              </div>
              <div className={styles.date}>{new Date(diary.date).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}

      <footer>
        <br />
        <br />
        <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
      </footer>

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>감정 분석 결과</h2>
            <p>{analysis}</p>
            <button onClick={() => setModalOpen(false)} className={styles.closeButton}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
