import { useEffect } from 'react';
import { GenUI } from '@sudobility/genui';
import { Button } from '@sudobility/components';
import { useApi } from '@sudobility/building_blocks/firebase';
import { SEO } from '@sudobility/seo_lib';
import { useChatManager, hasInputControls } from '@sudobility/genuivo_lib';
import { useSetPageConfig } from '../hooks/usePageConfig';
import { GOOGLE_MAPS_API_KEY } from '../config/chat';
import { seoConfig } from '../config/seo';
import { analyticsService } from '../config/analytics';

export default function ChatPage() {
  useSetPageConfig({ maxWidth: '4xl', contentPadding: 'md' });

  useEffect(() => {
    analyticsService.trackPageView('/chat', 'Chat');
  }, []);

  const { networkClient, baseUrl, userId, token } = useApi();
  const { currentRenderable, isLoading, error, handleAction, handleSubmit, restart } =
    useChatManager({ networkClient, baseUrl, userId, token });

  const showSubmit = hasInputControls(currentRenderable);
  const showRestart = !showSubmit && !isLoading;

  return (
    <>
      <SEO config={seoConfig} title="Chat" noIndex />
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
            <span className="ml-3 text-sm text-slate-500">Thinking...</span>
          </div>
        ) : null}

        {showSubmit && !isLoading ? (
          <Button type="button" onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        ) : null}

        {showRestart ? (
          <Button type="button" variant="secondary" onClick={restart} className="w-full">
            New Conversation
          </Button>
        ) : null}
      </div>
    </>
  );
}
