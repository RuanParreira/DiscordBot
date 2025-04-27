const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pausar")
        .setDescription("Pausa as Musicas"),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id); //pega a fila

        if (!queue || !queue.currentTrack) {
            return interaction.reply("Não há nenhuma música tocando no momento para pausar!");
        }

        try {
            queue.node.setPaused(!queue.node.isPaused()); //pausa a musica e continuar tocando se já estiver pausando
            return interaction.reply("Musicas Pausadas!");
        } catch (error) {
            console.error(error);
            return interaction.reply("Ocorreu um erro ao tentar parar a musica.");
        }
    }
}
