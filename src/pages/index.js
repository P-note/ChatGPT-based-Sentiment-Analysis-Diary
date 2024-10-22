import { Flex, Button, Container, Box, Text, Card, Inset, Heading, Blockquote } from "@radix-ui/themes"
import Link from 'next/link';

export default function Home() {
    return (
      <Container maxWidth="50rem" maxHeight="100%" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '85vh'  // Full height of the viewport
      }}>
        <Card m="8" size="5" style={{height: "30rem"}} align="center" >
          <Inset clip="padding-box">
          <Flex direction="column" align="center" gap="7" mt="7">
            <Box mt="9">
              <Heading as="h1" size="8" trim="normal">dIAry 시작하기</Heading>
            </Box>

            <Blockquote align="center">
            <Text size="4" weight="medium">dIAry는 ChatGPT 기반 감정분석 다이어리입니다.<br/>
            매일매일 일기를 쓰고 저장할 수 있습니다.<br/>
            간편하게 여러분의 하루에 대한 감정분석 결과를 받아보세요.<br/>
            </Text>
            </Blockquote>
            
            <Box>
            <Link href="/login">
              <Button variant="soft" color="indigo" size="4">Click to Start</Button>
            </Link>
            </Box>

          </Flex>
          </Inset>
        </Card>
      </Container>
    );
  }
  