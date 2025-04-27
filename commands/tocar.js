const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tocar')
        .setDescription('Reproduz uma música no canal de voz.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('O nome ou URL da música que você deseja reproduzir.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer(); // Obtém a instância do player
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply('Você precisa estar em um canal de voz para usar este comando!');
        }

        const query = interaction.options.getString('query', true); // Obtém a consulta da música

        // Deferimos a interação, pois o processamento pode levar tempo
        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel, // Define o canal para enviar mensagens
                    },
                },
            });

            return interaction.followUp(`**${track.cleanTitle}** foi adicionado à fila!`);
        } catch (e) {
            // Retorna um erro caso algo dê errado
            return interaction.followUp(`Algo deu errado: ${e.message}`);
        }
    },
};