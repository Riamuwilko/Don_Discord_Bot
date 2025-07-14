const { SlashCommandBuilder } = require('discord.js');
const { splitwise_api_key, groupId } = require('../../config.json');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debt')
		.setDescription('Check the expense/debt of all user in a group'),
	async execute(interaction) {
		// tell discord to defer
		await interaction.deferReply();

        // Make API Call
        try {
            const response = await axios.get(`https://secure.splitwise.com/api/v3.0/get_group/${groupId}`, {
                headers: {
                    'Authorization': `Bearer ${splitwise_api_key}`,
                    'Content-Type': 'application/json',
                },
            });

            const groupData = response.data.group;
            let message = `**${groupData.name} - Balances**\n`;
            groupData.members.forEach(member => {
                const fullName = member.last_name ? `${member.first_name} ${member.last_name}` : member.first_name;
                member.balance.forEach(balance => {
                    const amount = parseFloat(balance.amount);
                    const status = amount > 0 ? 'is owed' : amount < 0 ? 'owes' : 'is settled';
                    const absAmount = Math.abs(amount).toFixed(2);
                    message += `${fullName}: ${status} ${balance.currency_code} ${absAmount}\n`;
                });
            });
            await interaction.editReply(message);
        }
        catch (error) {
            console.error(error);
            await interaction.reply('Error fetching balances from Splitwise');
        }
	},
};