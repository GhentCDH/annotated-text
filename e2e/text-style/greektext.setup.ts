// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';

// Clear any cached instances
clearAnnotatedTextCache();

// Sample Greek papyrus text with line numbers
// Format: "line_number.text" separated by newlines
const greekPapyrusText = `1.Χ[αι]ρήμ[ων] Ἀπολλωνίωι τῶι
2.[φι]λτάτωι χαίρειν.
3.ἐκομισάμην παρὰ Ἡρακλείδου
4.τοῦ ἀδελφοῦ σου ἐπιστολὴν
5.ἐν ᾗ δηλοῖς μοι ὅτι ἀπέστειλας`;

// Basic Greek text with line adapter
const greekBasic =
  createAnnotatedText('greek-basic').setTextAdapter(TextLineAdapter());
greekBasic.setText(greekPapyrusText);

// Greek text with annotations
const greekAnnotated =
  createAnnotatedText('greek-annotated').setTextAdapter(TextLineAdapter());
greekAnnotated.setText(greekPapyrusText).setAnnotations([
  { id: 'name-1', start: 0, end: 12 }, // Χ[αι]ρήμ[ων]
  { id: 'name-2', start: 13, end: 24 }, // Ἀπολλωνίωι
  { id: 'greeting', start: 29, end: 50 }, // φιλτάτωι χαίρειν
  { id: 'name-3', start: 70, end: 80 }, // Ἡρακλείδου
]);

// Greek text with RTL option (though Greek is LTR, testing the option)
const greekRtl = createAnnotatedText('greek-rtl').setTextAdapter(
  TextLineAdapter({ textDirection: 'rtl' }),
);

greekRtl
  .setText(
    `1.πρῶτος λόγος
2.δεύτερος λόγος
3.τρίτος λόγος`,
  )
  .setAnnotations([
    { id: '1', start: 0, end: 6 }, // πρῶτος
    { id: '2', start: 20, end: 29 }, // δεύτερος
  ]);

// Interactive Greek text
const greekInteractive = createAnnotatedText('greek-interactive')
  .setTextAdapter(TextLineAdapter())
  .setAnnotationAdapter({ edit: true, create: true });

const eventLog = document.getElementById('event-log')!;

greekInteractive
  .setText(
    `1.Ὅμηρος ἦν ποιητὴς ἀρχαῖος
2.ἔγραψε τὴν Ἰλιάδα καὶ τὴν Ὀδύσσειαν
3.πολλοὶ αὐτὸν θαυμάζουσι`,
  )
  .setAnnotations([
    { id: 'homer', start: 0, end: 6 }, // Ὅμηρος
  ])
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
(window as any).__greekTestInstances = {
  greekBasic,
  greekAnnotated,
  greekRtl,
  greekInteractive,
};
