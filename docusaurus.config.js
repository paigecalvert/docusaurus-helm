// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Helm',
  tagline: 'The Kubernetes Package Manager',
  favicon: 'img/helm-icon-color.svg',

  // Set the production url of your site here
  url: 'https://helm4docs.r6by.com/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'paigecalvert', // Usually your GitHub org/user name.
  projectName: 'docusaurus-helm-test', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: {
        htmlLang: 'en-us',
        label: 'English',
      },
      es: {
        label: 'Español',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/paigecalvert/docusaurus-helm-test/blob/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/paigecalvert/docusaurus-helm-test',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      algolia: {
        // The application ID provided by Algolia
        appId: 'A0EQ8MMS8V',
        // Public API key: it is safe to commit it
        apiKey: '3ccfbf5fb8bc395cc5f09939fa69c0fe',
        indexName: 'Docusaurus Helm 4 Docs Website',
      },  
      navbar: {
        title: 'Helm',
        logo: {
          alt: 'Site Logo',
          src: 'img/helm.svg',
          // srcDark: 'img/helm.svg',
          href: '/',
          target: '_self',
          width: 55,
          height: 55,
          className: 'custom-navbar-logo-class',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            versions: ['current', '2.0', '1.0'],
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {to: '/docs/intro', label: 'Docs', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/helm/community',
            label: 'Community',
            position: 'left',
          },
          {
            href: 'https://artifacthub.io/',
            label: 'Charts',
            position: 'left',
          },
          {
            href: 'https://github.com/helm',
            label: 'GitHub',
            position: 'left',
          },
        ],
      },
      colorMode: {
        disableSwitch: true,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Community',
                href: 'https://github.com/helm/community',
              },
              {
                label: 'Slack',
                href: 'https://kubernetes.slack.com/',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/kubernetes-helm',
              },
              {
                label: 'X',
                href: 'https://x.com/helmpack',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/helm',
              },
            ],
          },
        ],
        copyright: `
          <div class="footer__bottom">
            <div class="footer__cncf-section">
              <div class="footer__cncf-text">
                <p>We are a Cloud Native Computing Foundation graduated project.</p>
              </div>
              <div class="footer__cncf-logo">
                <img src="/img/cncf-white.png" alt="CNCF Logo" />
              </div>
            </div>
            <div class="footer__copyright-text">
              Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.
            </div>
          </div>
        `,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
