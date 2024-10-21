import { Flex, Button, Container, Box, Text, Strong } from "@radix-ui/themes"
import Link from 'next/link';

export default function Home() {
    return (
      <Container maxWidth="70rem" maxHeight="100%">
      <Flex direction="column" align="center" gap="5">
        <Box mt="9">
          <Text size="8" weight="bold">dIAry 시작하기</Text>
        </Box>

        <Box align="center">
        <Text size="3" weight="medium">dIAry는 ChatGPT 기반 감정분석 다이어리입니다.<br/>
          간단한 일기를 쓰면 감정을 분석해줍니다.<br/>
          (feat. ChatGPT)
        </Text>
        </Box>
        
        <Box>
        <Link href="/login">
          <Button variant="soft" color="indigo" size="3">Click to Start</Button>
        </Link>
        </Box>

      </Flex>
      </Container>
    );
  }
  