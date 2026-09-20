// src/index.js
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
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

  // Format "The Evidence" links section
  const linksSection = processedArticles
    .map((item, i) => `${i + 1}. ${item.source} [${item.title}](${item.url})`)
    .join('\n');

  const finalMessage = `☕ *Morning Chaos Briefing*\n\n${briefing}\n\n*The Evidence:*\n${linksSection}`;

  // Broadcast to Telegram
  await sendToTelegram(finalMessage);

  // Generate public/briefing.json for the Web Dashboard & API
  const outputData = {
    updatedAt: new Date().toISOString(),
    briefing,
    evidence: processedArticles.map(item => ({
      source: item.source,
      title: item.title,
      url: item.url,
      facts: item.facts
    }))
  };

  try {
    const publicDir = path.resolve(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(
      path.join(publicDir, 'briefing.json'),
      JSON.stringify(outputData, null, 2)
    );
    console.log("Successfully written static API to public/briefing.json");
  } catch (error) {
    console.error("Failed to write public/briefing.json:", error.message);
  }
}

runChaosRoutine();