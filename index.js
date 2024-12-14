const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./src/handlers/commandHandler');
const { log } = require('./src/utils/logger');
require('dotenv').config();

const mode = process.env.DEV_MODE === 'true' ? 'DEVELOPMENT' : 'PRODUCTION';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Map();

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag} (${mode} MODE)`);
    log(`Bot logged in as ${client.user.tag} (${mode} MODE)`);
});

// Register commands dynamically based on mode
registerCommands(client);

// Handle interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.warn(`[WARN] Command ${interaction.commandName} not found.`);
        await interaction.reply({ content: 'Command not found.', ephemeral: true });
        return;
    }

    try {
        console.log(`[INFO] Executing command: ${interaction.commandName}`);
        await command.execute(interaction);
    } catch (error) {
        console.error('[ERROR] Failed to execute command:', error);
        await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
});

// Log in the bot
client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
    console.error('[ERROR] Failed to login:', error);
});
