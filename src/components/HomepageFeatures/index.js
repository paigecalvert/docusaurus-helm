import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
// Import the translate() function for Docusaurus internationalization
// We use translate() instead of <Translate/> component because:
// - translate() returns strings (needed for data structures)
// - <Translate/> returns JSX elements (better for static content)
import {translate} from '@docusaurus/Translate';

// FeatureList contains all user-visible text that needs translation
// Each translate() call includes:
// - id: unique identifier for the translation key
// - message: default text in the site's default language  
// - description: context for translators
const FeatureList = [
  {
    // Feature 1: Easy to Use
    title: translate({
      id: 'homepage.features.easyToUse.title',
      message: 'Easy to Use',
      description: 'The title for the Easy to Use feature'
    }),
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: translate({
      id: 'homepage.features.easyToUse.description',
      message: 'Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly.',
      description: 'The description for the Easy to Use feature'
    }),
  },
  {
    // Feature 2: Focus on What Matters
    title: translate({
      id: 'homepage.features.focusOnWhatMatters.title',
      message: 'Focus on What Matters',
      description: 'The title for the Focus on What Matters feature'
    }),
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: translate({
      id: 'homepage.features.focusOnWhatMatters.description',
      message: 'Docusaurus lets you focus on your docs, and we\'ll do the chores. Go ahead and move your docs into the docs directory.',
      description: 'The description for the Focus on What Matters feature'
    }),
  },
  {
    // Feature 3: Powered by React
    title: translate({
      id: 'homepage.features.poweredByReact.title',
      message: 'Powered by React',
      description: 'The title for the Powered by React feature'
    }),
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: translate({
      id: 'homepage.features.poweredByReact.description',
      message: 'Extend or customize your website layout by reusing React. Docusaurus can be extended while reusing the same header and footer.',
      description: 'The description for the Powered by React feature'
    }),
  },
];

// Feature component renders individual feature cards
// No translation needed here since title and description are already translated strings
function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

// Main component that renders all features
// Next steps for translation:
// 1. Run: npm run write-translations -- --locale [target-locale]
// 2. This creates i18n/[locale]/code.json with translation keys
// 3. Translate the "message" values in those JSON files
export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
