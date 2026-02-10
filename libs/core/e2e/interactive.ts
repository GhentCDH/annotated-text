// Import styles directly (not through index.ts to avoid Istanbul/Babel issues)
import '../src/lib/style/style.scss';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { clearAnnotatedTextCache, createAnnotatedText } from '@ghentcdh/annotated-text';

// Clear any cached instances
clearAnnotatedTextCache();

// Interactive with event logging
const interactive = createAnnotatedText('interactive').setAnnotationAdapter({
  edit: true,
  create: false,
});

const eventLog = document.getElementById('event-log')!;

interactive
  .setText(
    'Click on annotations to see events. Try selecting text to create new annotations.',
  )
  .setAnnotations([])
  .on('all', (event) => {
    const logEntry = document.createElement('div');
    logEntry.textContent = `Event: ${event.event} - ${JSON.stringify(event.data?.id ?? event.data)}`;
    eventLog.appendChild(logEntry);

    // Keep only last 5 events
    while (eventLog.children.length > 5) {
      eventLog.removeChild(eventLog.firstChild!);
    }
  });

// Expose for test access
(window as any).__testInstances = {
  interactive,
};
