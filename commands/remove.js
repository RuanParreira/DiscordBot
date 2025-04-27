const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove uma música específica da fila.")
        .addIntegerOption(option =>
            option
                .setName("posição")
                .setDescription("A posição da música na fila (começa em 1).")
                .setRequired(true)
        ),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id); // Obtém a fila da guilda

        if (!queue || !queue.tracks.size) {
            return interaction.reply("A fila está vazia no momento!");
        }

        const trackNumber = interaction.options.getInteger("posição"); // Obtém a posição fornecida pelo usuário
        const tracks = queue.tracks.toArray();

        if (trackNumber < 1 || trackNumber > tracks.length) {
            return interaction.reply(`Número inválido! Escolha um número entre 1 e ${tracks.length}.`);
        }

        const removedTrack = tracks[trackNumber - 1]; // Ajusta para índice baseado em 0
        queue.removeTrack(trackNumber - 1); // Remove a música da fila

        return interaction.reply(`🗑️ A música **${removedTrack.title}** foi removida da fila.`);
    },
};