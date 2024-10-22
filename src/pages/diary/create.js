import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Heading, Flex, Box, Container, TextArea, TextField } from '@radix-ui/themes';

export default function CreateDiary() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/diary/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error('일기 작성에 실패했습니다.');
      }

      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <Container style={styles.container}>
        <Heading as="h1" size="7" style={{margin: '2rem'}}>New Diary</Heading>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <Flex direction="column">
            <Box mb="5">
              <label htmlFor="title"><h4>제목</h4></label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.titleInput}
              />
            </Box>
            <Box mb="1">
              <label htmlFor="content"><h4>내용</h4></label>
              <TextArea mt="2" radius='large'
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={styles.textarea}
              />
            </Box>
            <Button type="submit" variant="soft" size="3" style={styles.button}>
              저장
            </Button>
          </Flex>
        </form>
      </Container>
    </Container>
  );
}

const styles = {
  container: {
    maxWidth: '50rem',
    margin: '0 auto',
    padding: '0.5rem',
    textAlign: 'center',
  },
  titleInput: {
    width: '100%',
    padding: '0.7rem',
    border: '0.1rem solid #ccc',
    borderRadius: '10px',
    fontFamily:"Noto Sans KR",
  },
  textarea: {
    width: '100%',
    border: '0.1rem solid #ccc',
    padding: '0.5rem',
    height: '30rem',
    fontFamily:"Noto Sans KR",
    fontSize: '1.2rem',
    resize: 'none',
  },
  button: {
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
};
