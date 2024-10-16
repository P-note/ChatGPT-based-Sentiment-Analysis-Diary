import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDiaries, setSelectedDiaries] = useState([]); // 선택된 일기들
  const [analysis, setAnalysis] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태
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
    router.push('/diary/create'); // 일기 작성 페이지로 이동
  };

  const handleDiaryClick = (id) => {
    router.push(`/diary/${id}`); //
  };

  // 여러 일기 체크, 해제 관리
  const handleSelectDiary = (id) => {
    setSelectedDiaries((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((diaryId) => diaryId !== id)
        : [...prevSelected, id]
    );
  };

  // 체크된 일기 내용 모두 분석
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
      setAnalysis(data.analysis); // 감정 분석 결과 설정
      setModalOpen(true); // 모달 열기
    } catch (error) {
      setError('감정 분석 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>대시보드</h1>
        <div>
          <button style={styles.button} onClick={handleNewDiary}>
            새 일기 작성
          </button>
          <button style={styles.analyzeButton} onClick={handleAnalyzeSelectedDiaries}>
            감정 분석
          </button>
        </div>
      </header>

      {loading ? (
        <p>일기 목록을 불러오는 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : diaries.length === 0 ? (
        <p>작성된 일기가 없습니다.</p>
      ) : (
        <ul style={styles.list}>
          {diaries.map((diary) => (
            <li key={diary._id} style={styles.listItem}>
              <input
                type="checkbox"
                checked={selectedDiaries.includes(diary._id)}
                onChange={() => handleSelectDiary(diary._id)}
                style={styles.checkbox}
              />
              <div style={styles.diaryContent}>
                <h2 style={styles.title}>{diary.title}</h2>
                <p style={styles.content}
                 onClick={() => handleDiaryClick(diary._id)}>
                  {diary.content.substring(0, 100)}...</p>
              </div>
              <small style={styles.date}>{new Date(diary.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}

      <footer>
        <br />
        <br />
        <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
      </footer>

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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f53d3d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  analyzeButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #ccc',
    textAlign: 'left',
    gap: '10px',
  },
  checkbox: {
    marginRight: '10px',
  },
  diaryContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  },
  content: {
    margin: 0,
    color: '#555',
    fontSize: '14px',
  },
  date: {
    whiteSpace: 'nowrap',
    color: '#888',
    fontSize: '12px',
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
