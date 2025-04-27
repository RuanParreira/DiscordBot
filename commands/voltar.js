const { SlashCommandBuilder } = require("discord.js");
const { useHistory } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voltar")
        .setDescription("Volta para a música anterior na fila."),
    async execute(interaction) {
        const history = useHistory(interaction.guild.id); // Obtém o histórico da guilda

        if (!history || !history.previousTrack) {
            return interaction.reply("Não há músicas anteriores para voltar!");
        }

        await history.previous(); // Volta para a música anterior

        return interaction.reply("⏮️ Voltando para a música anterior!");
    },
};