const { SlashCommandBuilder } = require('discord.js');
const { splitwise_api_key, groupId, splitwiseToDiscord } = require('../../config.json');
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
            // Map user IDs to names for easy lookup (without Splitwise ID)
            const idToName = {};
            groupData.members.forEach(member => {
                idToName[member.id] = member.last_name ? `${member.first_name} ${member.last_name}` : member.first_name;
            });

            // Balances section
            groupData.members.forEach(member => {
                const fullName = idToName[member.id];
                member.balance.forEach(balance => {
                    const amount = parseFloat(balance.amount);
                    if (amount === 0) {
                        message += `${fullName} is settled\n`;
                    }
                    else {
                        const status = amount > 0 ? 'is owed' : 'owes';
                        const absAmount = Math.abs(amount).toFixed(2);
                        message += `${fullName} ${status} ${balance.currency_code} ${absAmount}\n`;
                    }
                });
            });

            // Who owes who section
            if (groupData.simplified_debts && groupData.simplified_debts.length > 0) {
                message += '\n**Who owes who:**\n';
                groupData.simplified_debts.forEach(debt => {
                    const fromId = debt.from.toString();
                    const fromMention = splitwiseToDiscord[fromId] ? `<@${splitwiseToDiscord[fromId]}>` : idToName[debt.from] || `${debt.from}`;
                    // Only show name (not tag) for toMention
                    const toMention = idToName[debt.to] || `${debt.to}`;
                    const absAmount = Math.abs(parseFloat(debt.amount)).toFixed(2);
                    message += `${fromMention} owes ${toMention} ${debt.currency_code} ${absAmount}\n`;
                });
            }
            await interaction.editReply(message);
        }
        catch (error) {
            console.error(error);
            await interaction.reply('Error fetching balances from Splitwise');
        }
	},
};