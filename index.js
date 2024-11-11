const { Client, GatewayIntentBits, Partials } = require('discord.js');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "your token here gemini"; // https://aistudio.google.com/apikey
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Função para verificar se a mensagem é uma promoção ou divulgação
async function isPromotion(messageContent) {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(`A mensagem é uma divulgação? ${messageContent}, se for responda apenas com true ou false`);
    const responseText = result.response.text().trim(); // Normaliza a resposta
    return responseText.toLowerCase() === "true"; // Verifica se a resposta contém "true" em qualquer forma
}

// Criação do cliente com as intenções necessárias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

// Evento que escuta mensagens
client.on('messageCreate', async (message) => {
    // Verifica se a mensagem é uma DM
    if (message.guild) return; // Ignora mensagens de servidores

    const isPromo = await isPromotion(message.content); // Verifica se é promoção
    if (isPromo) {
        console.log("Banido!");
        const channelId = "";
        const channel = client.channels.cache.get(channelId);
        channel.send(`${message.author.username} foi banido por divulgação!\nDivulgação: \`\`\`${message.content}\`\`\``);
    }
});

// Login do bot
client.login('your token the discord here'); // Substitua pelo token do seu bot
