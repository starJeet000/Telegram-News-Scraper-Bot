// src/scrapers.js
import * as cheerio from 'cheerio';
import Parser from "rss-parser";
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const parser = new Parser({
  // Adding a custom User-Agent to prevent firewalls from blocking the RSS fetch
  customFields: {
    item: ['description', 'pubDate'],
  },
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
});

async function scrapeReddit() {
  try {
    const response = await fetch('https://www.reddit.com/r/programming/top.json?limit=3');
    const json = await response.json();
    return json.data.children.map(post => ({
      title: post.data.title,
      url: 'https://reddit.com' + post.data.permalink,
      source: 'r/programming'
    }));
  } catch (e) { return []; }
}

async function scrapeRSS(feedUrl, sourceName) {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.slice(0, 3).map(item => ({
      title: item.title,
      url: item.link,
      source: sourceName
    }));
  } catch (e) { 
    console.error(`RSS fetch failed for ${sourceName}:`, e.message);
    return []; 
  }
}

export async function runChaosRoulette() {
  console.log("Spinning the strictly-tech Chaos Roulette...");
  
  // Hacker News has been completely purged to stop general science bleed.
  // Replaced with highly-reliable pure tech and nanotech feeds.
  const sources = [
    scrapeReddit,
    () => scrapeRSS('https://spectrum.ieee.org/feeds/feed.rss', 'IEEE Spectrum'),
    () => scrapeRSS('https://www.sciencedaily.com/rss/matter_energy/nanotechnology.xml', 'ScienceDaily Nanotech'),
    () => scrapeRSS('https://feeds.arstechnica.com/arstechnica/technology-lab', 'Ars Technica Tech'),
    () => scrapeRSS('https://techcrunch.com/feed/', 'TechCrunch'),
    () => scrapeRSS('https://www.theverge.com/tech/rss/index.xml', 'The Verge Tech')
  ];

  const shuffled = sources.sort(() => 0.5 - Math.random());
  const selectedScrapers = shuffled.slice(0, 2);
  const results = await Promise.all(selectedScrapers.map(fn => fn()));
  return results.flat();
}

// Pure offline text extraction
export async function fetchArticleText(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await response.text();
    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    return article ? article.textContent : null;
  } catch (e) {
    console.error(`Failed to parse article body for ${url}`);
    return null;
  }
}

export async function fetchRawHTML(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (e) {
    console.error(`Failed to fetch HTML for ${url}`);
    return null;
  }
}