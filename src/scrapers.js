// src/scrapers.js
import * as cheerio from 'cheerio';
import Parser from "rss-parser";
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
});

// Non-tech topics filter to eliminate non-tech bleed
const NON_TECH_KEYWORDS = [
  'whale', 'dinosaur', 'fossil', 'archaeology', 'mating', 'wildlife', 'animal',
  'ocean', 'species', 'election', 'court', 'lawsuit', 'celebrity', 'movie',
  'sport', 'crime', 'politics', 'astronomy', 'homicide', 'murder'
];

// Core technical terms to validate borderline titles
const TECH_WHITELIST = [
  'code', 'dev', 'ai', 'software', 'hardware', 'bug', 'linux', 'api',
  'vulnerability', 'gpu', 'cpu', 'cloud', 'app', 'server', 'data', 'security',
  'cyber', 'model', 'llm', 'chip', 'semiconductor', 'kernel', 'web', 'framework'
];

function isTechRelated(title) {
  const lowerTitle = title.toLowerCase();

  // Reject explicitly if any non-tech keyword is present
  const containsNonTech = NON_TECH_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
  if (containsNonTech) return false;

  // Accept directly if it contains standard whitelist tech terms
  const containsTech = TECH_WHITELIST.some(term => lowerTitle.includes(term));
  if (containsTech) return true;

  // Default fallback: allow if no explicitly blocked terms were triggered
  return true;
}

async function scrapeHackerNews() {
  try {
    const response = await fetch('https://news.ycombinator.com', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
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

// Subreddit Mini-Roulette: Randomly picks one tech subreddit per execution
async function scrapeReddit() {
  const subreddits = ['programming', 'netsec', 'artificial', 'webdev', 'sysadmin'];
  const selectedSub = subreddits[Math.floor(Math.random() * subreddits.length)];

  try {
    const response = await fetch(`https://www.reddit.com/r/${selectedSub}/top.json?limit=5`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const json = await response.json();
    return json.data.children
      .filter(post => isTechRelated(post.data.title))
      .slice(0, 3)
      .map(post => ({
        title: post.data.title,
        url: 'https://reddit.com' + post.data.permalink,
        source: `r/${selectedSub}`
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
  console.log("Spinning the Expanded Tech Chaos Roulette...");

  const sources = [
    // Aggregators & Communities
    scrapeHackerNews,
    scrapeReddit,
    () => scrapeRSS('https://lobste.rs/rss', 'Lobste.rs'),
    () => scrapeRSS('https://dev.to/feed', 'Dev.to'),
    () => scrapeRSS('https://feed.infoq.com/', 'InfoQ'),

    // Cybersecurity
    () => scrapeRSS('https://www.bleepingcomputer.com/feed/', 'BleepingComputer'),
    () => scrapeRSS('https://krebsonsecurity.com/feed/', 'Krebs on Security'),

    // AI & Machine Learning
    () => scrapeRSS('https://techcrunch.com/category/artificial-intelligence/feed/', 'TechCrunch AI'),
    () => scrapeRSS('https://www.technologyreview.com/topic/artificial-intelligence/feed/', 'MIT Tech Review AI'),

    // Hardware, Silicon & Datacenters
    () => scrapeRSS('https://www.servethehome.com/feed/', 'ServeTheHome'),
    () => scrapeRSS('https://www.phoronix.com/phoronix-rss.php', 'Phoronix'),

    // Nanotech & General Tech Lab
    () => scrapeRSS('https://techxplore.com/rss-feed/', 'TechXplore'),
    () => scrapeRSS('https://www.sciencedaily.com/rss/matter_energy/nanotechnology.xml', 'ScienceDaily Nanotech'),
    () => scrapeRSS('https://feeds.arstechnica.com/arstechnica/technology-lab', 'Ars Technica Tech')
  ];

  // Shuffle and pick 2 sources randomly
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