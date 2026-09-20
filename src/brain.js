// src/brain.js
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import nlp from 'compromise';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Offline NLP Fact Extraction
export function extractOfflineFacts(rawHTML, url) {
  if (!rawHTML) return null;
  try {
    const doc = new JSDOM(rawHTML, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) return null;

    const docNLP = nlp(article.textContent);
    const sentences = docNLP.sentences().out('array').slice(0, 3);
    return sentences.length > 0 ? sentences.map(s => `• ${s}`).join('\n') : null;
  } catch (e) {
    return null;
  }
}

// 2. Gemini Persona Synthesis
export async function generateCynicalBriefing(processedArticles) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Offline Fallback if Gemini key is missing
  if (!apiKey) {
    console.log("No GEMINI_API_KEY found. Falling back to offline NLP summary.");
    return processedArticles.map(a => `*${a.title}*\n${a.facts || 'No summary available.'}`).join('\n\n');
  }

  try {
    console.log("Consulting The Exhausted Senior Engineer (Gemini)...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const articleContext = processedArticles.map((item, idx) =>
      `[Item ${idx + 1}] Source: ${item.source}\nTitle: ${item.title}\nExtracted Facts:\n${item.facts || 'None'}`
    ).join('\n\n');

    const prompt = `You are a highly cynical, exhausted senior software engineer drinking his 4th cup of coffee. 
Review these trending tech news items and extracted facts, then give me a sarcastic morning briefing. 
Roast the tech hype, corporate AI bubbles, useless frameworks, and industry absurdities.

RULES:
1. Write 3-4 short, punchy, satirical paragraphs summarizing and roasting the news.
2. Maintain a witty, exhausted, cynical tone.
3. Do NOT include an introductory phrase like "Here is your briefing". Jump straight into the commentary.

Articles:
${articleContext}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini request failed, falling back to offline summary:", error.message);
    return processedArticles.map(a => `*${a.title}*\n${a.facts || 'No summary available.'}`).join('\n\n');
  }
}