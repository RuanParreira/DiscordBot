const { SlashCommandBuilder } = require("discord.js");
const { useQueue, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botar")
        .setDescription("Insere uma música em uma posição específica na fila.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("O nome ou URL da música que você deseja inserir.")
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

        const query = interaction.options.getString("query", true);
        const position = interaction.options.getInteger("posição", true) - 1; // Ajusta para índice baseado em 0

        if (position < 0 || position > queue.tracks.size) {
            return interaction.reply(`Posição inválida! Escolha um número entre 1 e ${queue.tracks.size + 1}.`);
        }

        await interaction.deferReply();

        try {
            const searchResult = await player.search(query, { requestedBy: interaction.user });

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.followUp("Nenhuma música encontrada para a consulta fornecida.");
            }

            queue.insertTrack(searchResult.tracks[0], position); // Insere a música na posição especificada

            return interaction.followUp(`🎵 A música **${searchResult.tracks[0].title}** foi inserida na posição ${position + 1} da fila!`);
        } catch (error) {
            console.error(error);
            return interaction.followUp("Ocorreu um erro ao tentar inserir a música na fila.");
        }
    },
};