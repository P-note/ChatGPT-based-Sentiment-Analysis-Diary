import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Heading, Section, Strong } from '@radix-ui/themes';
import { Card, Flex } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import Link from 'next/link';
// import styles from '@/styles/login.module.css';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard'); // 로그인 성공 시 대시보드로 이동
      } else {
        setError(data.message || '로그인 실패');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleRegister = () => {
    router.push('/register'); // 회원가입 페이지로 이동
  };

  return (
    <Section style={styles.container}>
    <Card variant="surface" style={styles.card}>
      <Flex direction="column" gap="3">
        
        <Heading as="h1" size="7" m="4">Login to dIAry</Heading>
        {error && <Strong style={{ color: 'red' }}>{error}</Strong>}
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <Button type="submit" variant="soft" size="3" mt="2">
            로그인
          </Button>
        </form>
        
        <Link href="/register">
          <Button variant="soft" size="3" color="jade">
            회원가입
          </Button>
        </Link>
      
      </Flex>
    </Card>
    </Section>
  );
}

const styles = {
  container:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '85vh',
  },
  card: {
    maxWidth: '27rem',
    padding: '2rem',
    textAlign: 'center',
    border: '0.1rem solid #ccc',
    borderRadius: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.7rem',
    margin: '0.75rem 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  registerButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};
