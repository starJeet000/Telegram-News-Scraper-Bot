// src/discord.js
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function sendToDiscord(message) {
  if (!DISCORD_WEBHOOK_URL) return;

  console.log("Sending Briefing to Discord...");
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });

    if (!response.ok) {
      console.error(`Discord API Error: ${response.status}`);
    } else {
      console.log("Successfully delivered to Discord channel.");
    }
  } catch (error) {
    console.error("Failed to send to Discord:", error.message);
  }
}