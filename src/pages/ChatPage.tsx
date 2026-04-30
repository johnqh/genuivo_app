import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GenUI } from '@sudobility/genui';
import { useApi } from '@sudobility/building_blocks/firebase';
import { buttonVariant, designTokens } from '@sudobility/design';
import { useChatManager, hasInputControls } from '@sudobility/genuivo_lib';
import { useSetPageConfig } from '../hooks/usePageConfig';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import { GOOGLE_MAPS_API_KEY } from '../config/chat';
import SEOHead from '../components/SEOHead';
import { analyticsService } from '../config/analytics';

export default function ChatPage() {
  const { t } = useTranslation('common');
  const { navigate } = useLocalizedNavigate();
  useSetPageConfig({ maxWidth: '4xl', contentPadding: 'md' });

  useEffect(() => {
    analyticsService.trackPageView('/chat', 'Chat');
  }, []);

  const { userId, token } = useApi();
  const isLoggedIn = Boolean(userId && token);
  const { currentRenderable, isLoading, error, handleAction, handleSubmit, restart } =
    useChatManager({ userId, token });

  const showSubmit = hasInputControls(currentRenderable);
  const showRestart = !showSubmit && !isLoading;

  return (
    <>
      <SEOHead title={t('chat.title')} description="" noIndex />
      <div className="space-y-4">
        <GenUI
          renderable={currentRenderable}
          onAction={handleAction}
          googleMapsApiKey={GOOGLE_MAPS_API_KEY || undefined}
        />

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          >
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            <span className="ml-3 text-sm text-slate-500">{t('chat.thinking')}</span>
          </div>
        ) : null}

        {showSubmit && !isLoading ? (
          <button
            type="button"
            onClick={handleSubmit}
            className={`${buttonVariant('primary')} ${designTokens.radius.lg} w-full`}
          >
            {t('chat.submit')}
          </button>
        ) : null}

        {showRestart ? (
          <button
            type="button"
            onClick={restart}
            className={`${buttonVariant('secondary')} ${designTokens.radius.lg} w-full`}
          >
            {t('chat.newConversation')}
          </button>
        ) : null}

        {!isLoggedIn ? (
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('chat.webSearchDisclaimer')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`${buttonVariant('secondary')} ${designTokens.radius.lg} ml-4 shrink-0 text-sm`}
            >
              {t('chat.loginCta')}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
