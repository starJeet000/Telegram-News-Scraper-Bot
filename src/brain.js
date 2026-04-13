// src/brain.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateCynicalBriefing(newsItems) {
  console.log("Consulting The Exhausted Engineer...");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Map the items to a clean list of sources and titles
  const headlines = newsItems.map(item => `[${item.source}] ${item.title}`).join('\n');

  const prompt = `You are a highly cynical, exhausted senior software engineer drinking his 4th cup of coffee. 
    Review these trending tech headlines from various sources and give me a sarcastic morning briefing. 
    Roast the hype, the useless frameworks, and the corporate AI bubble.
    Keep it to 3-4 short paragraphs.
  
  Headlines:
  ${headlines}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Brain Exhausted, Time out:", error);
    return "The AI broke down crying. No news today. You have work to do idiot.";
  }
};
