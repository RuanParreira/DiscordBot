const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
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
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return interaction.reply("Não há uma fila ativa no momento!");
        }

        const query = interaction.options.getString("música"); // Obtém a música fornecida pelo usuário
        const tracks = queue.tracks.toArray(); // Obtém as músicas da fila

        if (tracks.length === 0) {
            return interaction.reply("A fila está vazia. Adicione músicas antes de usar este comando.");
        }

        // Gera as opções para o menu suspenso
        const menuOptions = tracks.map((track, index) => ({
            label: `${index + 1}. ${track.title}`,
            description: `Duração: ${track.duration}`,
            value: `${index}` // Índice da música na fila
        }));

        // Adiciona uma opção para inserir no final da fila
        menuOptions.push({
            label: "Final da fila",
            description: "Adiciona a música no final da fila.",
            value: `${tracks.length}`
        });

        // Cria o menu suspenso
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("select-position")
            .setPlaceholder("Escolha a posição na fila")
            .addOptions(menuOptions);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Envia o menu para o usuário
        await interaction.reply({
            content: "Escolha a posição onde deseja inserir a música:",
            components: [row]
        });

        // Coleta a interação do menu
        const filter = i => i.customId === "select-position" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async i => {
            const position = parseInt(i.values[0], 10); // Obtém a posição escolhida pelo usuário
            const searchResult = await player.search(query, { requestedBy: interaction.user });

            if (!searchResult || !searchResult.tracks.length) {
                return i.reply("Nenhuma música encontrada para a busca fornecida.");
            }

            queue.insertTrack(searchResult.tracks[0], position); // Insere a música na posição escolhida

            await i.update({
                content: `🎶 A música **${searchResult.tracks[0].title}** foi adicionada na posição ${position + 1} da fila.`,
                components: []
            });
        });

        collector.on("end", collected => {
            if (collected.size === 0) {
                interaction.editReply({
                    content: "Você não escolheu uma posição a tempo.",
                    components: []
                });
            }
        });
    },
};