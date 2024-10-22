// src/pages/register.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/register.module.css';
import { Button, Card, Section, Flex, Heading, Box } from '@radix-ui/themes';
import * as Form from "@radix-ui/react-form";

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 회원가입 성공 시 JWT 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Section className={styles.container}>
    <Card className={styles.registerContainer}>
      {/* <Heading mt="3">회원가입</Heading> */}
      <Heading m="4" style={{textAlign:"center"}}>회원가입</Heading>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
      <Flex direction="column" gap="5">
        <Box>
          <label htmlFor="username">사용자명</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />
        </Box>
        <Box>
          <label htmlFor="email">이메일 (로그인에 사용됩니다)</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
        </Box>
        <Box>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
        </Box>
        <Button variant="soft" type="submit" size="3">회원가입</Button>
        </Flex>
      </form>
  </Card>
  </Section>
  );
}
