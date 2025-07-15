// Load configuration from environment variables or config.json
function loadConfig() {
    // If running in Docker (environment variables available)
    if (process.env.DISCORD_TOKEN) {
        return {
            token: process.env.DISCORD_TOKEN,
            clientId: process.env.CLIENT_ID,
            guildId: process.env.GUILD_ID,
            splitwise_api_key: process.env.SPLITWISE_API_KEY,
            groupId: process.env.GROUP_ID,
            splitwiseToDiscord: JSON.parse(process.env.SPLITWISE_TO_DISCORD || '{}')
        };
    }
    else {
        // Fallback to config.json for local development
        try {
            return require('./config.json');
        }
        catch (error) {
            throw new Error('No configuration found. Please set environment variables or create config.json');
        }
    }
}

module.exports = loadConfig();