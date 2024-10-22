import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/dashboard.module.css';
import { Box, Button, Container, Flex, Heading, Card, AlertDialog } from '@radix-ui/themes';

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

  const checkEmptySelect = () => {
    if (selectedDiaries.length === 0) {
      alert('삭제할 일기를 선택하세요.');
      return;
    }
  }

  const handleDeleteSelectedDiaries = async () => {
    if (selectedDiaries.length === 0) {
      alert('삭제할 일기를 선택하세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/diary/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ diaryIds: selectedDiaries }),
      });

      if (!res.ok) {
        throw new Error('일기 삭제에 실패했습니다.');
      }

      alert('선택된 일기가 삭제되었습니다.');
      // 일기 목록 갱신
      setDiaries((prevDiaries) => prevDiaries.filter((diary) => !selectedDiaries.includes(diary._id)));
      setSelectedDiaries([]); // 선택된 일기 목록 초기화
    } catch (error) {
      setError('일기 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container className={styles.container}>
      <Card direction="column" className={styles.flexContainer}>
      <Box>
      <div className={styles.header}>
        <Heading as="h1" size="8" m="4">대시보드</Heading>
        <Flex gap = "3">
          <Button variant='soft' color='blue' size='3' onClick={handleNewDiary}>
            새 일기 작성
          </Button>
          {/* <Button variant='soft' size='3' color='blue' onClick={handleAnalyzeSelectedDiaries}>
            감정 분석
          </Button> */}
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button variant='soft' size='3' color='red'>
                일기 삭제
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Revoke access</AlertDialog.Title>
              <AlertDialog.Description size="2">
                선택한 일기를 삭제하시겠습니까? 
                삭제한 후에는 복구할 수 없습니다.
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    취소
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="red" onClick={handleDeleteSelectedDiaries}>
                    삭제
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Flex>
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

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>감정 분석 결과</h2>
            <p>{analysis.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}</p>
            <button onClick={() => setModalOpen(false)} className={styles.closeButton}>
              닫기
            </button>
          </div>
        </div>
      )}
      </Box>
      </Card>
      <Box className={styles.logoutWrapper}>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <Button variant='outline' size='3' color='ruby' className={styles.logoutButton}>로그아웃</Button>
          </AlertDialog.Trigger>

          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>로그아웃</AlertDialog.Title>
            <AlertDialog.Description size="2">
              정말 로그아웃하시겠습니까?
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  취소
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button variant="solid" color="red" onClick={handleLogout}>
                  로그아웃
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>

        </AlertDialog.Root>
      </Box>
    </Container>
  );
}
