const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pular")
        .setDescription("Pula a música atual na fila."),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id); // Obtém a fila da guilda

        if (!queue || !queue.currentTrack) {
            return interaction.reply("Não há nenhuma música tocando no momento para pular!");
        }

        try {
            queue.node.skip(); // Pula a música atual
            return interaction.reply("A música atual foi pulada com sucesso!");
        } catch (error) {
            console.error(error);
            return interaction.reply("Ocorreu um erro ao tentar pular a música.");
        }
    },
};