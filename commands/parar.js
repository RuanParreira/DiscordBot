const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("parar")
        .setDescription("Parar as Musicas"),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id); //pega a fila

        if (!queue || !queue.currentTrack) {
            return interaction.reply("Não há nenhuma música tocando no momento para parar!");
        }

        try {
            queue.delete();
            return interaction.reply("Musicas Paradas!");
        } catch (error) {
            console.error(error);
            return interaction.reply("Ocorreu um erro ao tentar parar a musica.");
        }
    }
};
