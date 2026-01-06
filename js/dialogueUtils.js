export function preprocessDialogue(md) {
  return md.replace(
    /:::question\s+([\s\S]*?)\s+:::/g,
    '<div class="question">\n$1\n</div>'
  );
}

// js/dialogueUtils.js

export function extractExcerpt(md) {
  const questionRegex = /:::question\s+([\s\S]*?)\s+:::/g;

  const matches = [...md.matchAll(questionRegex)];

  if (matches.length === 0) {
    // fallback: prime N righe se non troviamo domande
    return md.split('\n').slice(0, 6).join('\n');
  }

  // prendiamo la prima domanda
  const firstQuestion = matches[0][0];

  // posizione della fine della prima domanda
  const endOfQuestionIndex =
    matches[0].index + firstQuestion.length;

  // prendiamo il testo subito dopo
  const remaining = md.slice(endOfQuestionIndex);

  // estraiamo il primo paragrafo / blocco successivo
  const nextBlockMatch = remaining.match(
    /\n\s*\n([\s\S]*?)(\n\s*\n|$)/
  );

  const firstAnswer = nextBlockMatch
    ? nextBlockMatch[1].trim()
    : '';

  return `${firstQuestion}\n\n${firstAnswer}`;
}
