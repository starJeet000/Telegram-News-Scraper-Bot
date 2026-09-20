// src/scrapers.js
import * as cheerio from 'cheerio';
import Parser from "rss-parser";
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
});

// Non-tech topics filter to prevent general science/biology bleed
const NON_TECH_KEYWORDS = ['whale', 'dinosaur', 'fossil', 'archaeology', 'mating', 'wildlife', 'animal', 'ocean', 'species'];

function isTechRelated(title) {
  const lowerTitle = title.toLowerCase();
  return !NON_TECH_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
}

async function scrapeHackerNews() {
  try {
    const response = await fetch('https://news.ycombinator.com');
    const html = await response.text();
    const $ = cheerio.load(html);
    const posts = [];

    $('.titleline > a').each((i, el) => {
      const title = $(el).text();
      if (isTechRelated(title) && posts.length < 3) {
        posts.push({
          title,
          url: new URL($(el).attr('href'), 'https://news.ycombinator.com').href,
          source: 'Hacker News'
        });
      }
    });
    return posts;
  } catch (e) { return []; }
}

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
    return feed.items
      .filter(item => isTechRelated(item.title || ''))
      .slice(0, 3)
      .map(item => ({
        title: item.title,
        url: item.link,
        source: sourceName
      }));
  } catch (e) { return []; }
}

export async function runChaosRoulette() {
  console.log("Spinning the Chaos Roulette...");
  const sources = [
    scrapeHackerNews,
    scrapeReddit,
    () => scrapeRSS('https://techxplore.com/rss-feed/', 'TechXplore'),
    () => scrapeRSS('https://phys.org/rss-feed/nanotech-news/', 'ScienceX Nanotech'),
    () => scrapeRSS('https://feeds.arstechnica.com/arstechnica/technology-lab', 'Ars Technica'),
    () => scrapeRSS('https://techcrunch.com/feed/', 'TechCrunch')
  ];

  const shuffled = sources.sort(() => 0.5 - Math.random());
  const selectedScrapers = shuffled.slice(0, 2);
  const results = await Promise.all(selectedScrapers.map(fn => fn()));
  return results.flat();
}

export async function fetchRawHTML(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (e) { return null; }
}