const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("baguncar")
        .setDescription("Embaralha a fila de músicas."),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id); // Obtém a fila da guilda

        if (!queue || !queue.tracks.size) {
            return interaction.reply("A fila está vazia no momento, não há nada para embaralhar!");
        }

        queue.tracks.shuffle(); // Embaralha a fila

        return interaction.reply("🔀 A fila foi embaralhada com sucesso!");
    },
};