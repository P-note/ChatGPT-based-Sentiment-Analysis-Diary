import { Theme } from "@radix-ui/themes";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
 
export default function Layout({ children }) {
  return (
    <>
      <Theme>
        <Header />
          <section>{children}</section>
        <Footer />
      </Theme>
    </>
  )
}