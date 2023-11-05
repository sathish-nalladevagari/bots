import Express from "express";
import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import striptags from "striptags";

const WikiPediaToken = "6523996331:AAHjprf95zMldoeTlRz79vB6zALn7twMUPY";

const PORT = 5000;
const app = Express();

app.use(Express.json());

const bot = new TelegramBot(WikiPediaToken, { polling: true });

async function getRandomWikipediaArticleTitle() {
  const response = await fetch(
    "https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&format=json"
  );
  const data = await response.json();
  const title = data.query.random[0].title;
  return title;
}

async function getWikipediaSummary(title) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&titles=${encodeURIComponent(
      title
    )}&format=json`
  );

  const data = await response.json();
  const page = data.query.pages[Object.keys(data.query.pages)[0]];
  const plainTextSummary = striptags(page.extract).replace(/\n+/g, "\n").trim(); 

  return plainTextSummary;
}

async function getWiki(){
    return pass
}

function sendTelegramMessage(chatId, message) {
  bot.sendMessage(chatId, message);
}

bot.onText(/\/randomwiki/, async (msg) => {

  const chatId = msg.chat.id;

  try {
    
    const title = await getRandomWikipediaArticleTitle();

    const summary = await getWikipediaSummary(title);
   

    const message = `Random Wikipedia Article: ${title}\n\n${summary}`;
    sendTelegramMessage(chatId, message);
  } 
    catch (error) {
    console.error("Error:", error);
    sendTelegramMessage(
      chatId,
      "An error occurred while fetching the article."
    );
  }
});


app.listen(PORT, () => {
  console.log("Server Started");
});
