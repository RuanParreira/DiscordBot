const { SlashCommandBuilder } = require("discord.js");
const { useQueue, QueueRepeatMode } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repetir")
        .setDescription("Ativa o modo de repetição para a música atual ou a fila.")
        .addStringOption(option =>
            option
                .setName("modo")
                .setDescription("Escolha o modo de repetição: música, fila ou desativar.")
                .setRequired(true)
                .addChoices(
                    { name: "Música", value: "música" },
                    { name: "Fila", value: "fila" },
                    { name: "Desativar", value: "desativar" }
                )
        ),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id); // Obtém a fila da guilda

        if (!queue) {
            return interaction.reply("Não há uma fila ativa no momento!");
        }

        const mode = interaction.options.getString("modo"); // Obtém o modo escolhido pelo usuário
        let repeatMode;

        if (mode === "música") {
            repeatMode = QueueRepeatMode.TRACK; // Repetir a música atual
        } else if (mode === "fila") {
            repeatMode = QueueRepeatMode.QUEUE; // Repetir a fila inteira
        } else if (mode === "desativar") {
            repeatMode = QueueRepeatMode.OFF; // Desativar repetição
        } else {
            return interaction.reply("Modo inválido! Escolha entre música, fila ou desativar.");
        }

        queue.setRepeatMode(repeatMode); // Define o modo de repetição

        const modeText =
            mode === "música"
                ? "🔂 Repetição ativada para a música atual!"
                : mode === "fila"
                    ? "🔁 Repetição ativada para a fila!"
                    : "⏹️ Repetição desativada!";

        return interaction.reply(modeText);
    },
};