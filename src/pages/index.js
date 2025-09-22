import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import { useState, useEffect } from 'react';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function BoatComponent() {
  const [isBadgeMode, setIsBadgeMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Switch to badge mode when scrolled down more than the viewport height
      const scrollPosition = window.scrollY;
      const triggerPoint = window.innerHeight * 0.7; // Trigger at 70% of viewport height
      
      setIsBadgeMode(scrollPosition > triggerPoint);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`boat ${isBadgeMode ? 'boat-badge' : 'boat-full'}`}>
      <img src="/img/boat.svg" alt="boat" className="boat-ship" />
      <div className="wave-wrapper">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(27,83,194,0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(27,83,194,0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(27,83,194,0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(27,83,194,1)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className="home-intro hero">
      <article>
        <img src="/img/helm.svg" alt="Helm" className="logo" />
        <h1>
          <strong>The</strong>
          <em>package manager</em>
          <strong>for Kubernetes</strong>
        </h1>
        <h2>
          Helm is the best way to find, share, and use software built for <a href="https://kubernetes.io">Kubernetes</a>.
        </h2>
      </article>
      
      <BoatComponent />
    </section>
  );
}

function InstallationSection() {
  const [activeTab, setActiveTab] = useState('Homebrew');

  const installCommands = {
    'Homebrew': 'brew install helm',
    'Chocolatey': 'choco install kubernetes-helm',
    'Scoop': 'scoop install helm',
    'Snap': 'sudo snap install helm --classic'
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="tile tile-actions is-parent is-horizontal">
      <div className="tile is-child">
        <h2>Get Helm</h2>
        <p>Helm can be installed from <a href="/docs/intro/install/">multiple sources</a>.</p>

        <ul className="tabs" data-tabgroup="tab-group">
          {Object.keys(installCommands).map(tab => (
            <li key={tab} id="tablinks">
              <a 
                href={`#${tab}`} 
                className={activeTab === tab ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab);
                }}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
        <div className="tabgroup">
          {Object.entries(installCommands).map(([tab, command]) => (
            <div 
              key={tab}
              className={`tabcontent ${activeTab === tab ? 'active' : ''}`} 
              id={tab}
            >
              <input 
                id={`copy${tab.toLowerCase()}`} 
                value={command} 
                readOnly
              />
              <button 
                onClick={() => copyToClipboard(command)}
                className="button"
              >
                Copy
              </button>
            </div>
          ))}
        </div>

        <p>Want to use a different package manager? See <a href="/docs/intro/install/">installation methods</a> for other options.</p>
      </div>

      <div className="tile is-child is-centered has-text-centered">
        <h2>Get Charts</h2>

        <p>Looking for Helm charts? Try <a href="https://artifacthub.io/">Artifact Hub</a>.</p>

        <div className="has-text-center is-centered">
          <p><a href="https://artifacthub.io/"><img src="/img/artifact-hub.jpg" alt="Artifact Hub" className="is-centered" /></a></p>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="helm-community">
      <h2 className="has-text-centered">Community</h2>
      <p className="has-text-centered">
        The Helm Project was created by <a href="https://www.deis.com">Deis</a> (now part of <a href="https://azure.microsoft.com/en-us/services/kubernetes-service/">Microsoft Azure</a>) and is now part of the <a href="https://www.cncf.io">Cloud Native Computing Foundation</a>.
      </p>

      <div className="columns is-desktop community-boxes">
        <div className="column is-one-third-desktop">
          <section className="box">
            <h1 className="title">Next Release</h1>
            <dl>
              <dt>
                Version <strong>v3.16.3</strong>
                <br />
                Date <strong>2024-11-12</strong>
                <br />
                <br />
                Please see our <a href="https://github.com/helm/helm/releases">release calendar</a> for upcoming releases.
              </dt>
            </dl>
          </section>

          <section className="box">
            <h1 className="title">Events</h1>
            <dl>
              <dt>Upcoming Events</dt>
              <dd><small className="placeholder">No upcoming events at this time. Please check back!</small></dd>
              <dt>Past Events</dt>
              <dd><a href="https://helm.sh/blog/2019-08-22-helm-turns-four/">Helm turned 4!</a></dd>
              <dd><a href="https://github.com/helm/community/blob/main/events/2019-helm-summit-amsterdam.md">Helm Summit 2019 Amsterdam</a></dd>
              <dd><a href="https://github.com/helm/community/blob/main/events/2018-helm-summit-portland.md">Helm Summit 2018 Portland</a></dd>
            </dl>
          </section>

          <section className="box">
            <h1 className="title">SIG Apps</h1>
            <h2 className="subtitle">
              Special Interest Group
            </h2>
            <p>Helm is part of the <a href="https://github.com/kubernetes/community/tree/master/sig-apps">SIG Apps</a> community.</p>
          </section>
        </div>

        <div className="column is-one-third-desktop">
          <section className="box">
            <h1 className="title">Developer Standup</h1>
            <h2 className="subtitle">
              <a href="https://zoom.us/j/696660622"><span className="icon"><i className="mdi mdi-message-video"></i></span> Thursdays 9:30-10am PT</a>
            </h2>
            <p>We hold a weekly developer standup. Everyone is welcome to <a href="https://zoom.us/j/696660622">join the call</a>.</p>
          </section>
          
          <section className="box">
            <h1 className="title">Slack</h1>
            <dl>
              <dt><span className="icon"><i className="mdi mdi-chat"></i></span> <a href="https://kubernetes.slack.com/messages/helm-users">#helm-users</a></dt>
              <dd>General questions and community support</dd>

              <dt><span className="icon"><i className="mdi mdi-chat"></i></span> <a href="https://kubernetes.slack.com/messages/helm-dev">#helm-dev</a></dt>
              <dd>Chart and Helm development discussion</dd>

              <dt><span className="icon"><i className="mdi mdi-chat"></i></span> <a href="https://kubernetes.slack.com/messages/charts">#charts</a></dt>
              <dd>Helm Charts development and discussion</dd>
            </dl>

            <h2 className="subtitle">
              <a href="http://slack.k8s.io/">Click here to join the Kubernetes Slack team</a>
            </h2>
          </section>
        </div>

        <div className="column is-one-third-desktop">
          <section className="box">
            <h1 className="title">Contribute</h1>
            <h2 className="subtitle">
              Your contribution is welcome!
            </h2>
            <p>Helm is a community project. We invite your participation through issues, pull requests, and community discussion. Check out our <a href="https://github.com/helm/helm/blob/main/CONTRIBUTING.md">contribution guidelines</a> for more information on how you can help.</p>
          </section>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Helm"
      description="The package manager for Kubernetes"
      wrapperClassName="page-wrapper page-home">
      <div id="helm" className="page-wrapper page-home">
        <HomepageHeader />
        
        <section className="home-overview-wrap">
          <section className="columns">
            <div className="column has-text-centered">
              <img src="/img/helm-pyramid.png" alt="Helm" className="pyramid" />
              <h2>What is Helm?</h2>
            </div>
          </section>

          <section className="content-wrapper columns">
            <div className="column is-three-fifths">
              <article className="lead">
                <p>
                  Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and upgrade even the most complex Kubernetes application.
                </p>
                <p>
                  Charts are easy to create, version, share, and publish — so start using Helm and stop the copy-and-paste.
                </p>
                <p>
                  Helm is a graduated project in the <a href="https://www.cncf.io">CNCF</a> and is maintained by the <a href="https://github.com/helm/community/blob/main/governance/governance.md">Helm community</a>.
                </p>
                
                <h3>Learn more:</h3>
                <ul>
                  <li><a href="./docs/topics/architecture/">Helm Architecture</a></li>
                  <li><a href="./docs/intro/quickstart/">Quick Start Guide</a></li>
                  <li><a href="https://www.youtube.com/watch?v=Zzwq9FmZdsU&t=2s">Video: An Introduction to Helm</a></li>
                </ul>
              </article>
            </div>
            <div className="column is-hidden-mobile tile-features is-two-fifths">
              <div className="tile is-parent is-vertical">
                <div className="tile is-child">
                  <p className="title">
                    Manage Complexity
                  </p>
                  <p>
                    Charts describe even the most complex apps, provide repeatable application installation, and serve as a single point of authority.
                  </p>
                </div>
                <div className="tile is-child">
                  <p className="title">
                    Easy Updates
                  </p>
                  <p>
                    Take the pain out of updates with in-place upgrades and custom hooks.
                  </p>
                </div>
                <div className="tile is-child">
                  <p className="title">
                    Simple Sharing
                  </p>
                  <p>
                    Charts are easy to version, share, and host on public or private servers.
                  </p>
                </div>
                <div className="tile is-child">
                  <p className="title">
                    Rollbacks
                  </p>
                  <p>
                    Use <code>helm rollback</code> to roll back to an older version of a release with ease.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <InstallationSection />

          <section className="has-text-centered columns">
            <nav className="level level-faqs">
              <div className="level-item has-text-centered is-hidden-mobile">
                <div>
                  <a><img src="/img/helm-3-badge.svg" alt="Helm 3" className="badge" /></a>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Upgrading from v2?</p>
                  <p className="title">Check out the migration guide.</p>
                </div>
              </div>
            </nav>
          </section>
        </section>

        <CommunitySection />
      </div>
    </Layout>
  );
}