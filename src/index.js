//src/index.js

import { runChaosRoulette } from "./scrapers.js";
import { generateCynicalBriefing } from "./brain.js";
import { sendToTelegram } from "./telegram.js";


async function runChaosRoutine() {

  const allNews = await runChaosRoulette();

  //1. get random news (6 items total from 2 sources)

  if (allNews.length === 0) {
    await sendToTelegram("The internet is dead. Scrapers failed. That is a very Good News");
    return;
  }

  //2. Feed it to Gemini the brain
  const briefing = await generateCynicalBriefing(allNews);

  //3. Format the links nicely
  const linksSection = allNews.map((item, i) => `${i + 1}. [${item.source}] [${item.title}](${item.url})`).join('\n');

  //4. combine and send
  const finalMessage = `☕ *Morning Chaos Briefing*\n\n${briefing}\n\n*The Evidence:*\n${linksSection}`;

  await sendToTelegram(finalMessage);
}

runChaosRoutine();
