import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Schema-First API',
    description: (
      <>
        Define chart intents using a typed OpenViz spec so generation stays
        predictable and safe across providers.
      </>
    ),
  },
  {
    title: 'Backend + React Flow',
    description: (
      <>
        Generate chart output on the server, then render with reusable React
        components in your app.
      </>
    ),
  },
  {
    title: 'Production Ready',
    description: (
      <>
        Use validation, strict typings, and observability-friendly boundaries
        to ship visualization features confidently.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

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
