import styles from './Navbar.module.css';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.meow}>MEOW'S</span>
          <span className={styles.helpline}> HELPLINE</span>
        </Link>
        <div className={styles.links}>
          <Link href="#mission" className={styles.link}>Our Mission</Link>
          <Link href="#features" className={styles.link}>Features</Link>
          <Link href="#chat" className={styles.cta}>Chat Now</Link>
        </div>
      </div>
    </nav>
  );
}
