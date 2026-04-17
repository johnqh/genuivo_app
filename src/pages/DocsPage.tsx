import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { SEO } from '@sudobility/seo_lib';
import { MasterDetailLayout } from '@sudobility/components';
import { textVariants, ui, designTokens } from '@sudobility/design';
import { useSetPageConfig } from '../hooks/usePageConfig';
import { seoConfig } from '../config/seo';
import { analyticsService } from '../config/analytics';

const SECTION_IDS = [
  'overview',
  'howItWorks',
  'chat',
  'layouts',
  'maps',
  'clarification',
  'webSearch',
] as const;

type SectionId = (typeof SECTION_IDS)[number];

const CONTENT_KEYS: Record<SectionId, { title: string; body: string }> = {
  overview: { title: 'docs.content.overviewTitle', body: 'docs.content.overviewBody' },
  howItWorks: { title: 'docs.content.howItWorksTitle', body: 'docs.content.howItWorksBody' },
  chat: { title: 'docs.content.chatTitle', body: 'docs.content.chatBody' },
  layouts: { title: 'docs.content.layoutsTitle', body: 'docs.content.layoutsBody' },
  maps: { title: 'docs.content.mapsTitle', body: 'docs.content.mapsBody' },
  clarification: {
    title: 'docs.content.clarificationTitle',
    body: 'docs.content.clarificationBody',
  },
  webSearch: { title: 'docs.content.webSearchTitle', body: 'docs.content.webSearchBody' },
};

export default function DocsPage() {
  const { t } = useTranslation('common');
  const { lang } = useParams<{ lang: string }>();
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [mobileView, setMobileView] = useState<'navigation' | 'content'>('navigation');

  useSetPageConfig({ scrollable: false, contentPadding: 'sm', maxWidth: '7xl' });

  useEffect(() => {
    analyticsService.trackPageView('/docs', 'Docs');
  }, []);

  const keys = CONTENT_KEYS[activeSection];

  const masterContent = (
    <>
      <ul className="space-y-1" role="tablist" aria-orientation="vertical">
        {SECTION_IDS.map(id => (
          <li key={id} role="presentation">
            <button
              role="tab"
              aria-selected={activeSection === id}
              aria-controls="docs-content"
              onClick={() => {
                analyticsService.trackButtonClick('docs_section', { section: id });
                setActiveSection(id);
                setMobileView('content');
              }}
              className={`w-full text-left px-3 py-2 ${designTokens.radius.md} text-sm ${ui.transition.default} ${
                activeSection === id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                  : 'text-theme-text-secondary hover:bg-theme-hover-bg'
              }`}
            >
              {t(`docs.sections.${id}`)}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        <a
          href="https://github.com/johnqh/genui/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-3 py-2 text-sm ${ui.text.linkSubtle}`}
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {t('docs.githubRepo')}
        </a>
      </div>
    </>
  );

  const detailContent = (
    <div id="docs-content" role="tabpanel" aria-label={t(keys.title)}>
      <h2 className={`${textVariants.heading.h3()} mb-4`}>{t(keys.title)}</h2>
      <p className={`${textVariants.body.md()} leading-relaxed whitespace-pre-line`}>
        {t(keys.body)}
      </p>
    </div>
  );

  return (
    <div className="w-full min-w-0 overflow-x-hidden flex-1 flex flex-col min-h-0">
      <SEO
        config={seoConfig}
        title={t('docs.title')}
        description={t('docs.description')}
        canonical={`/${lang || 'en'}/docs`}
      />
      <MasterDetailLayout
        masterTitle={t('docs.title')}
        masterContent={masterContent}
        detailContent={detailContent}
        detailTitle={t(keys.title)}
        mobileView={mobileView}
        onBackToNavigation={() => setMobileView('navigation')}
        masterWidth={220}
        stickyMaster
      />
    </div>
  );
}
