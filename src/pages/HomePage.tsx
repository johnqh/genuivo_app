import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '@sudobility/components';
import { textVariants, buttonVariant, designTokens, ui } from '@sudobility/design';
import LocalizedLink from '../components/layout/LocalizedLink';
import { SEOHead, buildHowToSchema } from '@sudobility/seo_lib';
import { analyticsService } from '../config/analytics';

/** Landing page showcasing the application's key features and entry points. */
export default function HomePage() {
  const { t } = useTranslation('common');
  const { t: tHowTo } = useTranslation('howto');

  useEffect(() => {
    analyticsService.trackPageView('/', 'Home');
  }, []);

  const seoTitle = t('seo.home.title');
  const seoDescription = t('seo.home.description');
  const rawKeywords = t('seo.home.keywords', { returnObjects: true });
  const seoKeywords = Array.isArray(rawKeywords) ? rawKeywords : undefined;

  const rawSteps = tHowTo('home.steps', { returnObjects: true });
  const howToSchema = Array.isArray(rawSteps)
    ? buildHowToSchema(
        tHowTo('home.name'),
        tHowTo('home.description'),
        rawSteps as { name: string; text: string }[]
      )
    : undefined;

  return (
    <article>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        structuredData={howToSchema}
      />
      <Section spacing="5xl" variant="hero" maxWidth="3xl">
        <header className="text-center">
          <h1 className={`${textVariants.heading.h1()} mb-6`}>{t('home.title')}</h1>
          <p className={`${textVariants.body.lg()} mb-8`}>{t('home.description')}</p>
          <nav className="flex gap-4 justify-center" aria-label="Primary actions">
            <LocalizedLink
              to="/docs"
              className={`${buttonVariant('primary')} ${designTokens.radius.lg} px-6 py-3 ${ui.transition.default}`}
            >
              {t('home.viewDocs')}
            </LocalizedLink>
            <LocalizedLink
              to="/chat"
              className={`${buttonVariant('outline')} ${designTokens.radius.lg} px-6 py-3 ${ui.transition.default}`}
            >
              {t('home.startChat', 'Start Chat')}
            </LocalizedLink>
          </nav>
        </header>
      </Section>

      <Section spacing="3xl" maxWidth="4xl">
        <section aria-label="Features">
          <h2 className="sr-only">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              className={`${ui.spacing.card.md} ${designTokens.radius.lg} border ${ui.border.default}`}
            >
              <h3 className={`${textVariants.heading.h4()} mb-2`}>{t('home.feature1Title')}</h3>
              <p className={textVariants.body.sm()}>{t('home.feature1Desc')}</p>
            </div>
            <div
              className={`${ui.spacing.card.md} ${designTokens.radius.lg} border ${ui.border.default}`}
            >
              <h3 className={`${textVariants.heading.h4()} mb-2`}>{t('home.feature2Title')}</h3>
              <p className={textVariants.body.sm()}>{t('home.feature2Desc')}</p>
            </div>
            <div
              className={`${ui.spacing.card.md} ${designTokens.radius.lg} border ${ui.border.default}`}
            >
              <h3 className={`${textVariants.heading.h4()} mb-2`}>{t('home.feature3Title')}</h3>
              <p className={textVariants.body.sm()}>{t('home.feature3Desc')}</p>
            </div>
          </div>
        </section>
      </Section>
    </article>
  );
}
