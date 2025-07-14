const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Helper to find the command file path recursively
function findCommandFile(commandsDir, commandName) {
    const files = fs.readdirSync(commandsDir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(commandsDir, file.name);
        if (file.isDirectory()) {
            const result = findCommandFile(fullPath, commandName);
            if (result) return result;
        }
        else if (
            file.isFile() &&
            file.name === `${commandName}.js`
        ) {
            return fullPath;
        }
    }
    return null;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }

        // Find the command file path
        const commandsDir = path.join(__dirname, '..');
        const commandFilePath = findCommandFile(commandsDir, command.data.name);

        if (!commandFilePath) {
            return interaction.reply(`Could not find the file for command \`${command.data.name}\`.`);
        }

        delete require.cache[require.resolve(commandFilePath)];

        try {
            const newCommand = require(commandFilePath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        }
        catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading command \`${command.data.name}\`:\n\`${error.message}\``);
        }
    },
};