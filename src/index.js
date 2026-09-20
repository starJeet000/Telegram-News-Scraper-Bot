// src/index.js
import 'dotenv/config';
import { runChaosRoulette, fetchRawHTML } from "./scrapers.js";
import { processArticleHTML } from "./brain.js";
import { broadcastNews } from "./telegram.js";

async function runChaosRoutine() {
  console.log("Spinning the offline Chaos Roulette...");
  const allNews = await runChaosRoulette();

  if (!allNews || allNews.length === 0) {
    console.log("No news fetched today. Scrapers failed.");
    return;
  }

  let successCount = 0;

  for (const item of allNews) {
    // Stop after successfully broadcasting 1 article 
    if (successCount >= 1) break;

    // Skip GitHub repos because Readability cannot parse code trees accurately
    if (item.source === 'Github') continue;

    try {
      const rawHTML = await fetchRawHTML(item.url);
      if (!rawHTML) {
        console.log(`Skipping ${item.url}: Failed to fetch HTML.`);
        continue;
      }

      const summary = processArticleHTML(item.url, rawHTML);
      if (summary.startsWith("ERROR")) {
        console.log(`Skipping ${item.url}: NLP Pipeline extraction failed.`);
        continue;
      }

      // Pass the structured object to telegram.js for formatting
      await broadcastNews({
        source: item.source,
        title: item.title,
        summary: summary,
        url: item.url
      });

      successCount++;
    } catch (error) {
      // Intercept blocks or crashes and proceed to the next item
      console.error(`Unexpected error processing ${item.url}:`, error.message);
      continue;
    }
  }

  if (successCount === 0) {
    console.log("All scraped articles were blocked by the source or failed text extraction.");
  }
}

runChaosRoutine();