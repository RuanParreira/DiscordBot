const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("limpar")
        .setDescription("Remove todas as mensagens do canal atual."),
    async execute(interaction) {
        // Verifica se o comando foi executado em um canal de texto
        if (!interaction.channel || !interaction.channel.isTextBased()) {
            return interaction.reply("Este comando só pode ser usado em canais de texto!", { ephemeral: true });
        }

        // Verifica se o bot tem permissão para gerenciar mensagens
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply("Eu não tenho permissão para gerenciar mensagens neste canal!", { ephemeral: true });
        }

        try {
            // Remove todas as mensagens do canal
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });
            await interaction.channel.bulkDelete(fetchedMessages, true);

            await interaction.reply("Todas as mensagens foram removidas com sucesso!");
        } catch (error) {
            console.error(error);
            await interaction.reply("Ocorreu um erro ao tentar remover as mensagens.");
        }
    },
};