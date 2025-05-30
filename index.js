require("dotenv").config();
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
const fs = require("node:fs");
const path = require("node:path");

const ffmpegPath = require('ffmpeg-static');

// Adicionando a intenção 'GuildVoiceStates'
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();

// Configurando o Player
const player = new Player(client);

// Carregando os extratores padrão
(async () => {
  await player.extractors.loadMulti(DefaultExtractors);
})();

// Evento emitido quando uma faixa começa a tocar
player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`Tocando a musica **${track.cleanTitle}**!`);
});

// Adicionando um listener para o evento 'playerError'
player.events.on('playerError', (queue, error) => {
  console.error(`Erro no player: ${error.message}`);
  queue.metadata.channel.send("Ocorreu um erro ao tentar reproduzir a música. Tente novamente mais tarde.");
});

// Adicionando um listener para o evento 'audioTrackError'
player.events.on('audioTrackError', (queue, error) => {
  console.error(`Erro ao processar a faixa: ${error.message}`);
  queue.metadata.channel.send("Não foi possível reproduzir essa música. Tente outra faixa.");
});

// Definindo o caminho para os comandos
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausentes`);
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Pronto! Login realizado como ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN); // Certifique-se de que o TOKEN está carregado no ambiente

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error("Comando não encontrado");
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply("Erro ao executar esse comando!");
  }
});