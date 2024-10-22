import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Flex, Container, Section, Tabs, Box} from '@radix-ui/themes';

export default function DiaryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(''); // 감정 분석 결과 상태
  const [analyzing, setAnalyzing] = useState(false); // 감정 분석 로딩 상태
  const [tabValue, setTabValue] = useState('content');

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
    setTabValue('analysis');
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
    <Container p="9">
    <Button variant="soft" size="3" radius="full" style={styles.backButton} onClick={() => router.back()}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    </Button>
    <Tabs.Root defaultValue="content" value={tabValue} onValueChange={setTabValue}>
      <Tabs.List>
        <Tabs.Trigger value="content">content</Tabs.Trigger>
        <Tabs.Trigger value="analysis">analysis</Tabs.Trigger>
        <Button variant="soft" size="3" onClick={handleAnalyzeSentiment} disabled={analyzing}>
                {analyzing ? '분석 중...' : '감정 분석'}
        </Button>
      </Tabs.List>

      <Box>
        <Tabs.Content value="content">
          <Flex direction="column" gap="4" pb="2">
            <Section style={styles.container}>
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
              {/* <Button variant="soft" size="3" onClick={handleAnalyzeSentiment} disabled={analyzing}>
                {analyzing ? '분석 중...' : '감정 분석'}
              </Button> */}
            </Section>
          </Flex>
        </Tabs.Content>

        <Tabs.Content value="analysis">
          <Section>
            {/* 감정 분석 결과 */}
            {!analyzing && !analysis && <p>아직 분석을 요청하지 않았습니다.</p>}
            {analyzing && <p>분석 중...</p>}
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
          </Section>
        </Tabs.Content>
      </Box>
    </Tabs.Root>

    </Container>
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
    top: '5rem',
    left: '2rem',
    cursor: 'pointer',
    zIndex: 1000,
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
    padding: '20px',
    backgroundColor: 'black',
    borderRadius: '8px',
    textAlign: 'left',
  },
};
