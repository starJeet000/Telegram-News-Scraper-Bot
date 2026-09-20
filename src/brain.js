// src/brain.js
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import nlp from 'compromise';

export function processArticleHTML(url, rawHTML) {
  console.log(`Processing HTML for: ${url}`);

  if (!rawHTML) return "ERROR: NO_HTML_PROVIDED";

  try {
    const doc = new JSDOM(rawHTML, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      return "ERROR: READABILITY_PARSE_FAILED";
    }

    const docNLP = nlp(article.textContent);
    const sentences = docNLP.sentences().out('array').slice(0, 3);

    if (sentences.length === 0) return "ERROR: NO_SENTENCES_FOUND";

    return sentences.map(s => `🔹 ${s}`).join('\n');
  } catch (error) {
    console.error("NLP Pipeline Error:", error);
    return "ERROR: PIPELINE_CRASHED";
  }
}