const path = require('path');
const fs = require('fs');
const { generateKillQuotaGoalsEmbed } = require('../embedHandlers/killQuotaGoalsEmbed');
const { generateRegimentEffortEmbed } = require('../embedHandlers/regimentEffortEmbed');
const { fetchKillStats, fetchWarEffortTotals } = require('../handlers/mysqlHandler');
const { getQuotaGoals, saveMessageId } = require('../handlers/persistentMessageHandler');
const fsPromises = require('fs/promises');
require('dotenv').config();

const PERSISTENT_FILE = path.resolve(__dirname, '../data/persistentMessage.json');

//console.log('[DEBUG] Resolved path:', PERSISTENT_FILE);

function ensurePersistentFile() {
    const dir = path.dirname(PERSISTENT_FILE);

    // Ensure the 'data' directory exists
    if (!fs.existsSync(dir)) {
        console.warn('[WARN] Data directory not found. Creating it...');
        fs.mkdirSync(dir, { recursive: true });
    }

    // Ensure the 'persistentMessage.json' file exists
    if (!fs.existsSync(PERSISTENT_FILE)) {
        console.warn('[WARN] persistentMessage.json not found. Creating it...');
        const defaultData = {
            killQuota: { channelId: '', messageId: '', terminidGoal: 0, automatonGoal: 0, illuminateGoal: 0 },
            regimentEffort: { channelId: '', messageId: '', interval: 600 }
        };
        fs.writeFileSync(PERSISTENT_FILE, JSON.stringify(defaultData, null, 2));
    }
}

ensurePersistentFile();

// Ensure the file exists on script load
ensurePersistentFile();

/**
 * Loads or updates the embeds for Kill Quota and Regiment Effort.
 * @param {Client} client - The Discord client instance.
 * @param {string} scope - The scope of the embed ('killQuota' or 'regimentEffort').
 */
async function loadOrUpdateEmbeds(client, scope) {
    try {
        // Read persistent data
        const data = JSON.parse(await fsPromises.readFile(PERSISTENT_FILE, 'utf8'));

        if (!data[scope]?.channelId) {
            console.warn(`[WARN] ${scope} channel ID not found. Skipping update.`);
            return;
        }

        const channel = await client.channels.fetch(data[scope].channelId).catch((error) => {
            console.error(`[ERROR] Failed to fetch channel for ${scope}:`, error);
            return null;
        });

        if (!channel) {
            console.warn(`[WARN] ${scope} channel could not be fetched. Skipping update.`);
            return;
        }

        let embed;
        if (scope === 'killQuota') {
            const totals = await fetchKillStats();
            const goals = await getQuotaGoals();
            embed = await generateKillQuotaGoalsEmbed(totals, goals, channel);
        } else if (scope === 'regimentEffort') {
            const totals = await fetchWarEffortTotals();
            embed = generateRegimentEffortEmbed(totals);
        }

        const messageId = data[scope]?.messageId;
        if (messageId) {
            try {
                const message = await channel.messages.fetch(messageId);
                await message.edit({ embeds: [embed] });
                console.log(`[INFO] ${scope} embed updated successfully.`);
            } catch (error) {
                if (error.code === 50001) {
                    console.error(`[ERROR] Missing Access to edit message in channel: ${channel.id}`);
                } else if (error.code === 10008) {
                    console.warn(`[WARN] Message not found: ${messageId}. Creating a new embed.`);
                    const message = await channel.send({ embeds: [embed] });
                    data[scope].messageId = message.id;
                    await fsPromises.writeFile(PERSISTENT_FILE, JSON.stringify(data, null, 2));
                } else {
                    console.error(`[ERROR] Failed to edit message for ${scope}:`, error);
                }
            }
        } else {
            try {
                const message = await channel.send({ embeds: [embed] });
                data[scope].messageId = message.id;
                await fsPromises.writeFile(PERSISTENT_FILE, JSON.stringify(data, null, 2));
                console.log(`[INFO] New ${scope} embed created and message ID saved.`);
            } catch (error) {
                console.error(`[ERROR] Failed to send new embed for ${scope}:`, error);
            }
        }
    } catch (error) {
        console.error(`[ERROR] Failed to update ${scope} embed:`, error);
    }
}

module.exports = { loadOrUpdateEmbeds };
