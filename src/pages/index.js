import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import { useState, useEffect } from 'react';

import Heading from '@theme/Heading';

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
    <div className="content-block home-intro">
      <div className="block-content text-centered">
        <h1>
          <strong>
            <Translate
              id="homepage.title"
              description="The main title on the homepage">
              The package manager for Kubernetes
            </Translate>
          </strong>
        </h1>
        <h2>
          <Translate
            id="homepage.subtitle.prefix"
            description="First part of the subtitle">
            Helm is the best way to find, share, and use software built for
          </Translate>{' '}
          <a href="https://kubernetes.io">
            Kubernetes
          </a>.
        </h2>
      </div>

      <BoatComponent />
    </div>
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
    <div className="tile tile-actions is-parent is-horizontal">
      <div className="tile is-child">
        <h2>
          <Translate
            id="installation.getHelm.title"
            description="The title for the Get Helm section">
            Get Helm
          </Translate>
        </h2>
        <p>
          <Translate
            id="installation.getHelm.description.prefix"
            description="First part of installation instructions">
            Install Helm with a package manager, or
          </Translate>{' '}
          <a href="https://github.com/helm/helm/releases/latest">
            <Translate
              id="installation.getHelm.downloadLink"
              description="The link text for downloading Helm binary">
              download a binary
            </Translate>
          </a>
.
        </p>

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
                <Translate
                  id="installation.copyButton"
                  description="The text for the copy button">
                  Copy
                </Translate>
              </button>
            </div>
          ))}
        </div>

        <p>
          <Translate
            id="installation.postInstall.instructions"
            description="Instructions after installing Helm"
            values={{
              docsLink: (
                <a href="./docs/intro/install/">
                  <Translate
                    id="installation.postInstall.docsLink"
                    description="Link to installation docs">
                    docs
                  </Translate>
                </a>
              ),
              installationLink: (
                <a href="./docs/intro/install/">
                  <Translate
                    id="installation.postInstall.installationLink"
                    description="Link to installation instructions">
                    installation
                  </Translate>
                </a>
              ),
              usageLink: (
                <a href="./docs/intro/using_helm/">
                  <Translate
                    id="installation.postInstall.usageLink"
                    description="Link to usage instructions">
                    usage instructions
                  </Translate>
                </a>
              ),
            }}>
            {'Once installed, unpack the helm binary and add it to your PATH and you are good to go! Check the {docsLink} for further {installationLink} and {usageLink}.'}
          </Translate>
        </p>
      </div>

      <div className="tile is-child is-centered has-text-centered">
        <h2>
          <Translate
            id="installation.getCharts.title"
            description="The title for the Get Charts section">
            Get Charts
          </Translate>
        </h2>

        <p>
          <Translate
            id="installation.getCharts.description"
            description="Description of where to find Helm charts"
            values={{
              artifactHubLink: (
          <a href="https://artifacthub.io">
            Artifact Hub
          </a>
              ),
              chartsLink: (
                <a href="https://artifacthub.io/packages/search?kind=0">
                  <Translate
                    id="installation.getCharts.chartsLink"
                    description="Link to Helm charts search">
                    Helm charts
                  </Translate>
                </a>
              ),
            }}>
            {'Visit {artifactHubLink} to explore {chartsLink} from numerous public repositories.'}
          </Translate>
        </p>

        <div className="has-text-center is-centered">
          <p>
            <a href="https://artifacthub.io/">
              <img 
                src="/img/artifact-hub.jpg" 
                alt="Artifact Hub" 
                className="is-centered" 
              />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function CommunitySection() {
  return (
    <div className="block-content">
      <h2 className="has-text-centered">
        <Translate
          id="community.title"
          description="The main title for the community section">
          Join the Community
        </Translate>
      </h2>
      <p className="has-text-centered">
        <Translate
          id="community.description"
          description="Description of the community section">
          More information about the Helm project, and how to contribute.
        </Translate>
      </p>

      <div className="columns is-desktop community-boxes">
        <div className="column is-one-third-desktop">
          <section className="box">
            <h2 className="title">
              <Translate
                id="community.nextRelease.title"
                description="Title for the next feature release section">
                Next Feature Release
              </Translate>
            </h2>
            <dl>
              <dt>
                <strong>
                  <Translate
                    id="community.nextRelease.versionLabel"
                    description="Label for version">
                    Version:
                  </Translate>
                </strong> v3.16.3
                <br />
                <strong>
                  <Translate
                    id="community.nextRelease.dateLabel"
                    description="Label for date">
                    Date:
                  </Translate>
                </strong>{' '}
                2024-11-12
                <br />
                <br />
                <a href="calendar/release">
                  <Translate
                    id="community.nextRelease.calendarLink"
                    description="Link to release calendar">
                    Release Calendar
                  </Translate>
                </a>
              </dt>
            </dl>
          </section>

          <section className="box">
            <h2 className="title">
              <Translate
                id="community.events.title"
                description="Title for the events section">
                Events
              </Translate>
            </h2>
            <dl>
              <dt>
                <Translate
                  id="community.events.upcoming"
                  description="Label for upcoming events">
                  Upcoming Events
                </Translate>
              </dt>
              <dd>
                <small className="placeholder">
                  <em>
                    2025-11-10 to 2025-11-13
                  </em> - <a href="https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/">
                    <Translate
                      id="community.events.kubeconNA2025"
                      description="Link to KubeCon North America 2025">
                      KubeCon North America
                    </Translate>
                  </a>
                </small>
              </dd>
              <dt>
                <Translate
                  id="community.events.past"
                  description="Label for past events">
                  Past Events
                </Translate>
              </dt>
              <dd>
                <em>
                  2025-04-01 to 2025-04-04
                </em> - <a href="https://events.linuxfoundation.org/archive/2025/kubecon-cloudnativecon-europe/">
                  <Translate
                    id="community.events.kubeconEU2025"
                    description="Link to KubeCon Europe 2025">
                    KubeCon Europe 2025
                  </Translate>
                </a>
              </dd>
              <dd>
                <em>
                  2024-11-12 to 2024-11-15
                </em> - <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-north-america/">
                  <Translate
                    id="community.events.kubeconNA2024"
                    description="Link to KubeCon North America 2024">
                    KubeCon North America 2024
                  </Translate>
                </a>
              </dd>
              <dd>
                <em>
                  2024-05-19 to 2024-05-22
                </em> - <a href="https://events.linuxfoundation.org/archive/2024/kubecon-cloudnativecon-europe/">
                  <Translate
                    id="community.events.kubeconEU2024"
                    description="Link to KubeCon Europe 2024">
                    KubeCon Europe 2024
                  </Translate>
                </a>
              </dd>
            </dl>
          </section>

          <section className="box">
            <h2 className="title">
              SIG Apps
            </h2>
            <h3 className="subtitle">
              <Translate
                id="community.sigApps.subtitle"
                description="Subtitle for SIG Apps section">
                A Special Interest Group for deploying and operating apps in Kubernetes.
              </Translate>
            </h3>
            <p>
              <a href="https://github.com/kubernetes/community/blob/master/sig-apps/README.md">
                SIG-Apps
              </a>{' '}
              <Translate
                id="community.sigApps.description1"
                description="First paragraph about SIG Apps">
                is a Special Interest Group for deploying and operating apps in Kubernetes.
              </Translate>
            </p>
            <p>
              <Translate
                id="community.sigApps.description2"
                description="Second paragraph about SIG Apps meetings"
                values={{
                  meetLink: (
                    <a href="https://github.com/kubernetes/community/blob/master/sig-apps/README.md">
                      <Translate
                        id="community.sigApps.meetLink"
                        description="Link to SIG Apps meetings">
                        meet each week
                      </Translate>
                    </a>
                  ),
                  youtubeLink: (
                    <a href="https://www.youtube.com/results?search_query=kubernetes+sig+apps">
                      <Translate
                        id="community.sigApps.youtubeLink"
                        description="Link to YouTube recordings">
                        shared to YouTube
                      </Translate>
                    </a>
                  ),
                }}>
                {'They {meetLink} to demo and discuss tools and projects. Community meetings are recorded and {youtubeLink}.'}
              </Translate>
            </p>
          </section>
        </div>

        <div className="column is-one-third-desktop">
          <section className="box">
            <h2 className="title">
              <Translate
                id="community.standups.title"
                description="Title for Developer Standups section">
                Developer Standups
              </Translate>
            </h2>
            <h3 className="subtitle">
              <a href="https://zoom.us/j/696660622">
                <span className="icon"><i className="mdi mdi-message-video"></i></span>{' '}
                <Translate
                  id="community.standups.schedule"
                  description="Schedule for developer standups">
                  Thursdays 9:30-10am (PT)
                </Translate>
              </a>
            </h3>
            <p>
              <Translate
                id="community.standups.description"
                description="Description of developer standups"
                values={{
                  communityRepoLink: (
                    <a href="https://github.com/helm/community/blob/main/communication.md#meetings">
                      <Translate
                        id="community.standups.communityRepoLink"
                        description="Link to community repo">
                        community repo
                      </Translate>
                    </a>
                  ),
                }}>
                {'These meetings are open to all. Check the {communityRepoLink} for notes and details.'}
              </Translate>
            </p>
          </section>
          
          <section className="box">
            <h2 className="title">
              Slack
            </h2>
            <dl>
              <dt>
                <span className="icon"><i className="mdi mdi-chat"></i></span>{' '}
                <a href="https://kubernetes.slack.com/messages/helm-users">
                  Helm Users
                </a>
              </dt>
              <dd>
                <Translate
                  id="community.slack.helmUsersDescription"
                  description="Description of Helm Users channel">
                  Discussion around using Helm, working with charts and solving common errors.
                </Translate>
              </dd>

              <dt>
                <span className="icon"><i className="mdi mdi-chat"></i></span>{' '}
                <a href="https://kubernetes.slack.com/messages/helm-dev">
                  Helm Development
                </a>
              </dt>
              <dd>
                <Translate
                  id="community.slack.helmDevDescription"
                  description="Description of Helm Development channel">
                  Topics regarding Helm development, ongoing PRs, releases, etc.
                </Translate>
              </dd>

              <dt>
                <span className="icon"><i className="mdi mdi-chat"></i></span>{' '}
                <a href="https://kubernetes.slack.com/messages/charts">
                  Charts
                </a>
              </dt>
              <dd>
                <Translate
                  id="community.slack.chartsDescription"
                  description="Description of Charts channel">
                  Discussion for users and contributors to Helm Charts.
                </Translate>
              </dd>
            </dl>

            <h3 className="subtitle">
              <Translate
                id="community.slack.accessRequest"
                description="Instructions for requesting Slack access"
                values={{
                  accessLink: (
                    <a href="https://slack.k8s.io/">
                      <Translate
                        id="community.slack.accessLink"
                        description="Link to request Slack access">
                        Request access here
                      </Translate>
                    </a>
                  ),
                }}>
                {'{accessLink} to join the Kubernetes Slack team.'}
              </Translate>
            </h3>
          </section>
        </div>

        <div className="column is-one-third-desktop">
          <section className="box">
            <h2 className="title">
              <Translate
                id="community.contributing.title"
                description="Title for Contributing section">
                Contributing
              </Translate>
            </h2>
            <h3 className="subtitle">
              <Translate
                id="community.contributing.subtitle"
                description="Subtitle for Contributing section">
                Helm always welcomes new contributions to the project!
              </Translate>
            </h3>
            <h3>
              <Translate
                id="community.contributing.whereToBegin"
                description="Heading for where to begin">
                Where to begin?
              </Translate>
            </h3>
            <p>
              <Translate
                id="community.contributing.description1"
                description="First paragraph about contributing">
                Helm is a big project with a lot of users and contributors. It can be a lot to take in!
              </Translate>
            </p>
            <p>
              <Translate
                id="community.contributing.description2"
                description="Second paragraph about good first issues"
                values={{
                  goodFirstIssuesLink: (
                    <a href="https://github.com/helm/helm/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3A%22good+first+issue%22">
                      <Translate
                        id="community.contributing.goodFirstIssuesLink"
                        description="Link to good first issues">
                        good first issues
                      </Translate>
                    </a>
                  ),
                }}>
                {'We have a list of {goodFirstIssuesLink} if you want to help but don\'t know where to start.'}
              </Translate>
            </p>
            
            <h3>
              <Translate
                id="community.contributing.whatToDo"
                description="Heading for what to do">
                What do I do?
              </Translate>
            </h3>
            <p>
              <Translate
                id="community.contributing.description3"
                description="Third paragraph about contribution guide"
                values={{
                  contributionGuideLink: (
                    <a href="https://github.com/helm/helm/blob/main/CONTRIBUTING.md">
                      <Translate
                        id="community.contributing.contributionGuideLink"
                        description="Link to contribution guide">
                        Contribution Guide
                      </Translate>
                    </a>
                  ),
                }}>
                {'Before you contribute some code, please read our {contributionGuideLink}. It goes over the processes around creating and reviewing pull requests.'}
              </Translate>
            </p>
            <p>
              <Translate
                id="community.contributing.description4"
                description="Fourth paragraph about signing commits"
                values={{
                  signCommitsLink: (
                    <a href="blog/helm-dco">
                      <Translate
                        id="community.contributing.signCommitsLink"
                        description="Link to signing commits">
                        sign your commits
                      </Translate>
                    </a>
                  ),
                  dcoLink: (
                  <a href="https://developercertificate.org/">
                    DCO
                  </a>
                  ),
                  cncfLink: (
              <a href="https://www.cncf.io/">
                CNCF
              </a>
                  ),
                }}>
                {'Once you write some code, please {signCommitsLink} to ensure Helm adheres to the {dcoLink} agreement used by the {cncfLink}.'}
              </Translate>
            </p>
          </section>
        </div>
      </div>
      
      {/* Community Logos Section */}
      <div className="helm-contrib-logos">
        <img 
          src="/img/helm.svg" 
          alt={translate({
            message: 'Helm is supported by and built with a community of over 400 contributors',
            description: 'Alt text for Helm logo'
          })}
          className="helm-logo"
        />

        <p className="contributors">
          <Translate
            id="community.contributors.description"
            description="Description of Helm contributors">
            Helm is supported by and built with a community of over 400 developers.
          </Translate>
        </p>

        <div className="contrib-logos columns">
          <div className="column">
            <a target="_blank" href="https://bitnami.com/">
              <img src="/img/bitnami.png" alt="Bitnami" />
            </a>

            <a target="_blank" href="https://www.codecentric.de">
              <img src="/img/codecentric.png" alt="codecentric AG" />
            </a>

            <a target="_blank" href="https://codefresh.io/">
              <img src="/img/codefresh.png" alt="Codefresh" />
            </a>

            <a target="_blank" href="https://google.com/">
              <img src="/img/google.png" alt="Google" />
            </a>

            <a target="_blank" href="https://ibm.com">
              <img src="/img/ibm.png" alt="IBM" />
            </a>

            <a target="_blank" href="https://www.jetbrains.com/community/opensource/#support">
              <img src="/img/jetbrains.png" alt="Jetbrains" />
            </a>

            <a target="_blank" href="https://microsoft.com/">
              <img src="/img/microsoft.png" alt="Microsoft" />
            </a>

            <a target="_blank" href="https://montreal.ca">
              <img src="/img/montreal.png" alt="Montreal" />
            </a>

            <a target="_blank" href="https://www.redhat.com/">
              <img src="/img/redhat.png" alt="Redhat" />
            </a>

            <a target="_blank" href="https://www.replicated.com">
              <img src="/img/replicated.png" alt="Replicated" />
            </a>

            <a target="_blank" href="https://www.samsungsds.com">
              <img src="/img/samsungsds.png" alt="Samsung SDS" />
            </a>

            <a target="_blank" href="https://suse.com/">
              <img src="/img/suse.png" alt="SUSE" />
            </a>

            <a target="_blank" href="https://www.ticketmaster.com/">
              <img src="/img/tm.png" alt="Ticketmaster" />
            </a>
          </div>
        </div>

        <p className="contributors">
          <Translate
            id="community.contributors.final"
            description="Final paragraph about core maintainers"
            values={{
              helmLink: (
                <a href="https://github.com/helm/helm/blob/main/OWNERS">
                  helm
                </a>
              ),
            }}>
            {'...and many other wonderful {helmLink} core maintainers.'}
          </Translate>
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Helm"
      description="The package manager for Kubernetes"
      wrapperClassName="page-wrapper page-home">
      <div className="content-container">
        {/* First content block - pattern background with hero content and boat */}
        <HomepageHeader />

        {/* Second content block - blue background */}
        <div className="content-block">
          <div className="block-content">
            <h2 className="has-text-centered">
              <Translate
                id="main.whatIsHelm.title"
                description="Title for What is Helm section">
                What is Helm?
              </Translate>
            </h2>

            {/* Two Column Layout */}
            <div className="two-column layout-spacing">
              <div>
                <p>
                  <Translate
                    id="main.whatIsHelm.description1"
                    description="First paragraph about what Helm does">
                    Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and upgrade even the most complex Kubernetes application.
                  </Translate>
                </p>
                <p>
                  <Translate
                    id="main.whatIsHelm.description2"
                    description="Second paragraph about charts">
                    Charts are easy to create, version, share, and publish — so start using Helm and stop the copy-and-paste.
                  </Translate>
                </p>
                <p>
                  <Translate
                    id="main.whatIsHelm.description3"
                    description="Third paragraph about CNCF and community"
                    values={{
                      cncfLink: (
                  <a href="https://www.cncf.io">
                    CNCF
                  </a>
                      ),
                      communityLink: (
                        <a href="https://github.com/helm/community/blob/main/governance/governance.md">
                          <Translate
                            id="main.whatIsHelm.communityLink"
                            description="Link to Helm community">
                            Helm community
                          </Translate>
                        </a>
                      ),
                    }}>
                    {'Helm is a graduated project in the {cncfLink} and is maintained by the {communityLink}.'}
                  </Translate>
                </p>
                <h3>
                  <Translate
                    id="main.whatIsHelm.learnMore"
                    description="Heading for learn more section">
                    Learn more:
                  </Translate>
                </h3>
                <ul>
                  <li>
                    <a href="./docs/topics/architecture">
                      <Translate
                        id="main.whatIsHelm.architectureLink"
                        description="Link to Helm Architecture">
                        Helm Architecture
                      </Translate>
                    </a>
                  </li>
                  <li>
                    <a href="./docs/intro/quickstart">
                      <Translate
                        id="main.whatIsHelm.quickstartLink"
                        description="Link to Quick Start Guide">
                        Quick Start Guide
                      </Translate>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/watch?v=Zzwq9FmZdsU&t=2s">
                      <Translate
                        id="main.whatIsHelm.videoLink"
                        description="Link to Helm introduction video">
                        Video: An Introduction to Helm
                      </Translate>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="tile-features">
                  <div className="tile is-child">
                    <p className="title">
                      <Translate
                        id="main.features.manageComplexity.title"
                        description="Title for Manage Complexity feature">
                        Manage Complexity
                      </Translate>
                    </p>
                    <p>
                      <Translate
                        id="main.features.manageComplexity.description"
                        description="Description for Manage Complexity feature">
                        Charts describe even the most complex apps, provide repeatable application installation, and serve as a single point of authority.
                      </Translate>
                    </p>
                  </div>
                  <div className="tile is-child">
                    <p className="title">
                      <Translate
                        id="main.features.easyUpdates.title"
                        description="Title for Easy Updates feature">
                        Easy Updates
                      </Translate>
                    </p>
                    <p>
                      <Translate
                        id="main.features.easyUpdates.description"
                        description="Description for Easy Updates feature">
                        Take the pain out of updates with in-place upgrades and custom hooks.
                      </Translate>
                    </p>
                  </div>
                  <div className="tile is-child">
                    <p className="title">
                      <Translate
                        id="main.features.simpleSharing.title"
                        description="Title for Simple Sharing feature">
                        Simple Sharing
                      </Translate>
                    </p>
                    <p>
                      <Translate
                        id="main.features.simpleSharing.description"
                        description="Description for Simple Sharing feature">
                        Charts are easy to version, share, and host on public or private servers.
                      </Translate>
                    </p>
                  </div>
                  <div className="tile is-child">
                    <p className="title">
                      <Translate
                        id="main.features.rollbacks.title"
                        description="Title for Rollbacks feature">
                        Rollbacks
                      </Translate>
                    </p>
                    <p>
                      <Translate
                        id="main.features.rollbacks.description.prefix"
                        description="First part of rollbacks description">
                        Use
                      </Translate>{' '}
                      <code>helm rollback</code>{' '}
                      <Translate
                        id="main.features.rollbacks.description.suffix"
                        description="Last part of rollbacks description">
                        to roll back to an older version of a release with ease.
                      </Translate>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <InstallationSection />
          </div>
        </div>

        {/* Third content block - pattern background with community */}
        <div className="content-block">
          <CommunitySection />
        </div>
      </div>
    </Layout>
  );
}