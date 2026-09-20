// src/index.js
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Feed } from 'feed';
import { runChaosRoulette, fetchRawHTML } from "./scrapers.js";
import { extractOfflineFacts, generateCynicalBriefing } from "./brain.js";
import { sendToTelegram } from "./telegram.js";
import { sendToDiscord } from "./discord.js";

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

  // Broadcast to all configured channels
  await sendToTelegram(finalMessage);
  await sendToDiscord(finalMessage);

  // Web Dashboard API & RSS Generation
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

    // 1. Write JSON for the Web Dashboard
    await fs.writeFile(
      path.join(publicDir, 'briefing.json'),
      JSON.stringify(outputData, null, 2)
    );
    console.log("Successfully written static API to public/briefing.json");

    // 2. Generate and write RSS Feed
    const feed = new Feed({
      title: "Exhausted Senior Engineer Briefing",
      description: "Cynical morning tech briefings generated offline by an overworked AI.",
      id: "https://github.com/",
      link: "https://github.com/",
      language: "en",
      updated: new Date(),
      generator: "Chaos Routine Bot",
    });

    // Format the RSS item content with basic HTML so it renders cleanly in feed readers
    const htmlBriefing = briefing.replace(/\n/g, '<br>');
    const htmlEvidence = processedArticles
      .map((item, i) => `${i + 1}. <a href="${item.url}">${item.title}</a> (${item.source})`)
      .join('<br>');

    feed.addItem({
      title: `Tech Briefing - ${new Date().toLocaleDateString()}`,
      id: new Date().toISOString(),
      link: "https://github.com/",
      description: `${htmlBriefing}<br><br><b>The Evidence:</b><br>${htmlEvidence}`,
      date: new Date()
    });

    await fs.writeFile(path.join(publicDir, 'rss.xml'), feed.rss2());
    console.log("Successfully written RSS feed to public/rss.xml");

  } catch (error) {
    console.error("Failed to write public files:", error.message);
  }
}

runChaosRoutine();