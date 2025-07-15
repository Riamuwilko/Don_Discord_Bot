# Don Discord Bot (Splitwise Integration)

A Discord bot that integrates with Splitwise to manage group expenses and payments.

## Features

- Discord slash commands for expense management
- Splitwise API integration
- User mapping between Discord and Splitwise accounts

## Prerequisites

- Node.js 20.x
- Discord Bot Token
- Splitwise API Key
- Docker (optional)

## Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `config.json` file:
   ```json
   {
     "token": "your_discord_bot_token",
     "clientId": "your_discord_client_id",
     "guildId": "your_discord_guild_id",
     "splitwise_api_key": "your_splitwise_api_key",
     "groupId": "your_splitwise_group_id",
     "splitwiseToDiscord": {
       "splitwise_user_id": "discord_user_id"
     }
   }
   ```

4. Deploy commands and start the bot:
   ```bash
   npm start
   ```

## Docker Setup

1. Create a `.env` file:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_client_id
   GUILD_ID=your_discord_guild_id
   SPLITWISE_API_KEY=your_splitwise_api_key
   GROUP_ID=your_splitwise_group_id
   SPLITWISE_TO_DISCORD={"splitwise_user_id":"discord_user_id"}
   ```

2. Build and run with Docker:
   ```bash
   docker build -t don-discord-bot .
   docker run -d --name don-discord-bot --env-file .env don-discord-bot
   ```

3. Check logs:
   ```bash
   docker logs don-discord-bot
   ```

## Security Notes

- Never commit `config.json` or `.env` files to version control
- Use environment variables in production
- Keep your Discord token and Splitwise API key secure

## Commands

[Add your bot's available commands here]

## Contributing

[Add contribution guidelines if needed]
