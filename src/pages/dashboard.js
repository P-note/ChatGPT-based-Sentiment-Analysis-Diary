import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
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

  const handleNewDiary = () => {
    router.push('/diary/create'); // 일기 작성 페이지로 이동
  };

  const handleDiaryClick = (id) => {
    router.push(`/diary/${id}`); // 일기 세부 페이지로 이동
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('token'); // JWT 토큰 삭제
    router.push('/login'); // 로그인 페이지로 리디렉션
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>대시보드</h1>
        <div>
          <button style={styles.button} onClick={handleNewDiary}>
            새 일기 작성
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            로그아웃
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
            <li
              key={diary._id}
              style={styles.listItem}
              onClick={() => handleDiaryClick(diary._id)}
            >
              <h2 style={styles.title}>{diary.title}</h2>
              <p>{diary.content.substring(0, 100)}...</p>
              <small>{new Date(diary.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
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
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '15px',
    borderBottom: '1px solid #ccc',
    textAlign: 'left',
    cursor: 'pointer',
  },
  title: {
    color: '#0070f3',
    cursor: 'pointer',
  },
};
