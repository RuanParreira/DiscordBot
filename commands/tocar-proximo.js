const { SlashCommandBuilder } = require("discord.js");
const { useQueue, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tocar-proximo")
        .setDescription("Adiciona uma música em uma posição específica na fila.")
        .addStringOption(option =>
            option
                .setName("música")
                .setDescription("O nome ou URL da música que deseja adicionar.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("posição")
                .setDescription("A posição na fila onde a música será inserida (começa em 1).")
                .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return interaction.reply("Não há uma fila ativa no momento!");
        }

        const query = interaction.options.getString("música"); // Obtém a música fornecida pelo usuário
        const position = interaction.options.getInteger("posição"); // Obtém a posição fornecida pelo usuário

        const searchResult = await player.search(query, { requestedBy: interaction.user });

        if (!searchResult || !searchResult.tracks.length) {
            return interaction.reply("Nenhuma música encontrada para a busca fornecida.");
        }

        const tracks = queue.tracks.toArray();

        if (position < 1 || position > tracks.length + 1) {
            return interaction.reply(`Número inválido! Escolha um número entre 1 e ${tracks.length + 1}.`);
        }

        queue.insertTrack(searchResult.tracks[0], position - 1); // Insere a música na posição ajustada para índice 0

        return interaction.reply(`🎶 A música **${searchResult.tracks[0].title}** foi adicionada na posição ${position} da fila.`);
    },
};