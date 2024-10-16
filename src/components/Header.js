import Link from 'next/link';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link href="/">
          <div style={styles.logoText}>dIAry</div>
        </Link>
      </div>
      <nav style={styles.nav}>
        {/* free space */}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#0070f3',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
  },
};
