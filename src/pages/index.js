import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Translate, {translate} from '@docusaurus/Translate';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <img 
            src="img/helm.svg" 
            alt="Helm Logo" 
            className={styles.heroLogo}
          />
          <h1 className={styles.heroText}>
            The<br />
            package manager<br />
            for Kubernetes
          </h1>
        </div>
        <h2 className={styles.heroSubtitle}>
          Helm is the best way to find, share, and use software built for Kubernetes.
        </h2>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        id: 'homepage.title',
        message: 'Hello from {siteTitle}',
        description: 'The page title shown in browser tab and search results'
      }, {siteTitle: siteConfig.title})}
      description={translate({
        id: 'homepage.description',
        message: 'Description will go into a meta tag in <head />',
        description: 'The page description for SEO and social media sharing'
      })}
      wrapperClassName="homepage-wrapper">
      <HomepageHeader />
      <section className={styles.newSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What is Helm?</h2>
          <div className={styles.contentGrid}>
            <div className={styles.leftContainer}>
              <p className={styles.leftParagraph}>
                Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and upgrade even the most complex Kubernetes application.
              </p>
              <p className={styles.leftParagraph}>
                Charts are easy to create, version, share, and publish — so start using Helm and stop the copy-and-paste.
              </p>
              <p className={styles.leftParagraph}>
                Helm is a graduated project in the CNCF and is maintained by the Helm community.
              </p>
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.tile}>
                <h3 className={styles.tileHeading}>Manage Complexity</h3>
                <p className={styles.tileParagraph}>Charts describe even the most complex apps, provide repeatable application installation, and serve as a single point of authority.</p>
              </div>
              <div className={styles.tile}>
                <h3 className={styles.tileHeading}>Easy Updates</h3>
                <p className={styles.tileParagraph}>Take the pain out of updates with in-place upgrades and custom hooks.</p>
              </div>
              <div className={styles.tile}>
                <h3 className={styles.tileHeading}>Simple Sharing</h3>
                <p className={styles.tileParagraph}>Charts are easy to version, share, and host on public or private servers.</p>
              </div>
              <div className={styles.tile}>
                <h3 className={styles.tileHeading}>Rollbacks</h3>
                <p className={styles.tileParagraph}>Use helm rollback to roll back to an older version of a release with ease.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}