// src/components/Footer.js

export default function Footer() {
    return (
      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} dIAry. All rights reserved.</p>
      </footer>
    );
  }
  
  const styles = {
    footer: {
      backgroundColor: '#0070f3',
      color: '#fff',
      textAlign: 'center',
      padding: '10px 20px',
      position: 'fixed',
      bottom: 0,
      width: '100%',
    },
  };
  