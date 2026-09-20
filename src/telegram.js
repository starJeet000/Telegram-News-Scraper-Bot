// src/telegram.js
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendToTelegram(message) {
  console.log("Sending Briefing to Telegram...");
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true // Prevents massive image walls
      })
    });

    if (!response.ok) {
      console.error(`Telegram API Error: ${response.status}`);
    } else {
      console.log("Successfully delivered to Telegram channel.");
    }
  } catch (error) {
    console.error("Failed to send to Telegram:", error.message);
  }
}

// Alias for backwards compatibility if needed elsewhere
export const broadcastNews = sendToTelegram;