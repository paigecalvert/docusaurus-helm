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
        {/* Content will be added here */}
      </section>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}