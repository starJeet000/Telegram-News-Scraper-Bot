// src/index.js
import 'dotenv/config';
import { runChaosRoulette, fetchRawHTML } from "./scrapers.js";
import { extractOfflineFacts, generateCynicalBriefing } from "./brain.js";
import { sendToTelegram } from "./telegram.js";

async function runChaosRoutine() {
  console.log("Spinning the Chaos Routine...");
  const allNews = await runChaosRoulette();

  if (!allNews || allNews.length === 0) {
    await sendToTelegram("The internet is dead. Scrapers failed. That is very Good News.");
    return;
  }

  // Extract offline facts for each scraped article
  const processedArticles = [];
  for (const item of allNews) {
    const rawHTML = await fetchRawHTML(item.url);
    const facts = extractOfflineFacts(rawHTML, item.url);
    processedArticles.push({
      ...item,
      facts
    });
  }

  // Generate Gemini Sarcastic Briefing
  const briefing = await generateCynicalBriefing(processedArticles);

  // Format "The Evidence" links section exactly like the screenshot
  const linksSection = processedArticles
    .map((item, i) => `${i + 1}. ${item.source} [${item.title}](${item.url})`)
    .join('\n');

  const finalMessage = `☕ *Morning Chaos Briefing*\n\n${briefing}\n\n*The Evidence:*\n${linksSection}`;

  await sendToTelegram(finalMessage);
}

runChaosRoutine();