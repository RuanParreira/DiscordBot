const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fila")
        .setDescription("Mostra a fila de músicas em ordem."),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id); // Obtém a fila da guilda

        if (!queue || !queue.currentTrack) {
            return interaction.reply("Não há músicas na fila no momento!");
        }

        const currentTrack = queue.currentTrack; // Música atual
        const tracks = queue.tracks.toArray(); // Converte a fila em um array de músicas

        let response = `🎶 **Fila de músicas:**\n`;
        response += `▶️ Tocando agora: **${currentTrack.title}**\n\n`;

        if (tracks.length > 0) {
            response += tracks
                .map((track, index) => `${index + 1}. **${track.title}**`)
                .join("\n");
        } else {
            response += "A fila está vazia.";
        }

        return interaction.reply(response);
    },
};