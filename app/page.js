import styles from './page.module.css';
import Navbar from '../components/Navbar';
import Chat from '../components/Chat';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>You are not alone.</h1>
          <p className={styles.subtitle}>
            A safe space for teenagers in Manipur. We are here to listen, support, and help you through tough times. 
            <strong> Anonymous. Free. By teenagers, for teenagers.</strong>
          </p>
          <div className={styles.heroActions}>
            <a href="#chat" className={styles.primaryButton}>Talk to Us Now</a>
            <a href="#mission" className={styles.secondaryButton}>Learn More</a>
          </div>
        </div>
        <div className={styles.heroImagePlaceholder}>
          <div className={styles.blob}></div>
          <div className={styles.blob2}></div>
          <img src="/hero-illustration.png" alt="Comforting Illustration" className={styles.heroImage} />
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className={styles.missionSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <div className={styles.missionCard}>
            <p className={styles.missionText}>
              Started by teenagers who understand what you're going through. 
              We know the pressures of school, the pain of rumors and defamation, and the feeling that no one understands. 
              MEOW'S HELPLINE SERVICE was created so no teenager under 21 ever has to feel that half their problems can't be shared.
            </p>
            <p className={styles.missionText}>
              We saw that existing helplines lacked a Meitei lon service and sometimes felt disconnected from us. 
              We wanted to change that. We are here to bring you into the light.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Reach Out to Us?</h2>
          <div className={styles.grid}>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>🔒</div>
              <h3>100% Anonymous</h3>
              <p>You don't have to tell us who you are. Feel safe to open up completely.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>🗣️</div>
              <h3>Meitei Lon Support</h3>
              <p>Communicate comfortably in your own language. We understand you.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>🤝</div>
              <h3>By Teenagers</h3>
              <p>We are under 21, just like you. We relate to the struggles of high school.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section id="chat" className={styles.chatSection}>
        <div className={styles.container}>
          <div className={styles.chatHeaderInfo}>
            <h2 className={styles.sectionTitle}>Let's Chat</h2>
            <p className={styles.chatSubtitle}>It's safe, private, and we are ready to listen. Drop a message below.</p>
          </div>
          <Chat />
        </div>
      </section>
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} MEOW'S HELPLINE SERVICE.</p>
          <p className={styles.emergencyNote}>If you are in immediate danger or a problem is out of control, we can help you contact the police or emergency services.</p>
        </div>
      </footer>
    </main>
  );
}
