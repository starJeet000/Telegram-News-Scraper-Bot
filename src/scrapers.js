// src/scrapers.js
import * as cheerio from 'cheerio';
import Parser from "rss-parser";
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const parser = new Parser();

async function scrapeHackerNews() {
  try {
    const response = await fetch('https://news.ycombinator.com');
    const html = await response.text();
    const $ = cheerio.load(html);
    const posts = [];
    $('.titleline > a').slice(0, 3).each((i, el) => {
      posts.push({
        title: $(el).text(),
        url: new URL($(el).attr('href'), 'https://news.ycombinator.com').href,
        source: 'Hacker News'
      });
    });
    return posts;
  } catch (e) { return []; }
}

async function scrapeGithubTrending() {
  try {
    const response = await fetch('https://github.com/trending');
    const html = await response.text();
    const $ = cheerio.load(html);
    const repos = [];
    $('.Box-row h2 a').slice(0, 3).each((i, el) => {
      const title = $(el).text().replace(/\s+/g, ' ').trim();
      repos.push({
        title,
        url: 'https://github.com' + $(el).attr('href'),
        source: 'Github'
      });
    });
    return repos;
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
    return feed.items.slice(0, 3).map(item => ({
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
    scrapeGithubTrending,
    scrapeReddit,
    () => scrapeRSS('https://slashdot.org/slashdot.xml', 'Slashdot'),
    () => scrapeRSS('https://feeds.arstechnica.com/arstechnica/index', 'Ars Technica'),
    () => scrapeRSS('https://techcrunch.com/feed/', 'TechCrunch')
  ];

  const shuffled = sources.sort(() => 0.5 - Math.random());
  const selectedScrapers = shuffled.slice(0, 2);
  const results = await Promise.all(selectedScrapers.map(fn => fn()));
  return results.flat();
}

// NEW: Pure offline text extraction
export async function fetchArticleText(url) {
  try {
    const response = await fetch(url);
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
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.text();
  } catch (e) {
    console.error(`Failed to fetch HTML for ${url}`);
    return null;
  }
}