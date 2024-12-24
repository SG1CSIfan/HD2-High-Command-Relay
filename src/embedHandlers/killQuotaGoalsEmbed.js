const fsPromises = require('fs/promises');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const emojiMap = require('../utils/emojiMapLoader');
const { generateProgressBar } = require('../utils/progressBar');

const PERSISTENT_FILE = path.resolve(__dirname, '../data/persistentMessage.json');

/**
 * Generates the Kill Quota embed and checks for goal completions.
 * 
 * @param {Object} totals - The current kill stats.
 * @param {Object} goals - The target goals.
 * @param {Object} channel - The Discord channel to send victory messages.
 * @returns {EmbedBuilder} - The generated embed.
 */
async function generateKillQuotaGoalsEmbed(totals, goals, channel) {
    // Read persistent data
    const data = JSON.parse(await fsPromises.readFile(PERSISTENT_FILE, 'utf8'));

    // Convert stats to numbers
    const terminidKills = parseInt(totals.terminidKills, 10) || 0;
    const automatonKills = parseInt(totals.automatonKills, 10) || 0;
    const illuminateKills = parseInt(totals.illuminateKills, 10) || 0;

    // Default goals
    const terminidGoal = goals.terminidGoal || 1;
    const automatonGoal = goals.automatonGoal || 1;
    const illuminateGoal = goals.illuminateGoal || 1;

    // Check if goals are met
    const terminidMet = terminidKills >= terminidGoal;
    const automatonMet = automatonKills >= automatonGoal;
    const illuminateMet = illuminateKills >= illuminateGoal;

    // Handle individual goals
    if (terminidMet && !data.killQuota.terminidMet) {
        const timestamp = `<t:${Math.floor(Date.now() / 1000)}:F>`;
        await channel.send(`${emojiMap.terminid} **Terminid Quota Met** on ${timestamp}!`);
        data.killQuota.terminidMet = true;
    }

    if (automatonMet && !data.killQuota.automatonMet) {
        const timestamp = `<t:${Math.floor(Date.now() / 1000)}:F>`;
        await channel.send(`${emojiMap.automaton} **Automaton Quota Met** on ${timestamp}!`);
        data.killQuota.automatonMet = true;
    }

    if (illuminateMet && !data.killQuota.illuminateMet) {
        const timestamp = `<t:${Math.floor(Date.now() / 1000)}:F>`;
        await channel.send(`${emojiMap.illuminate} **Illuminate Quota Met** on ${timestamp}!`);
        data.killQuota.illuminateMet = true;
    }

    // Handle all goals met
    const allGoalsMet = terminidMet && automatonMet && illuminateMet;
    if (allGoalsMet && !data.killQuota.allGoalsMet) {
        const timestamp = `<t:${Math.floor(Date.now() / 1000)}:F>`;
        const finalMessage = `🪖 **MISSION ACCOMPLISHED!** 🪖\n\n🎉 **All Kill Quotas Have Been Met** on ${timestamp}!\n\n🌟 **High Command Commends Your Bravery!** 🌟\n\nGoals will be updated soon. Stay ready, Helldivers!`;

        await channel.send(finalMessage);
        data.killQuota.allGoalsMet = true;
    }

    // Save updated flags
    await fsPromises.writeFile(PERSISTENT_FILE, JSON.stringify(data, null, 2));

    // Progress bars
    const terminidBar = generateProgressBar(terminidKills, terminidGoal, emojiMap.HelldiverProgressBar, emojiMap.TerminidProgressBar);
    const automatonBar = generateProgressBar(automatonKills, automatonGoal, emojiMap.HelldiverProgressBar, emojiMap.AutomationProgressBar);
    const illuminateBar = generateProgressBar(illuminateKills, illuminateGoal, emojiMap.HelldiverProgressBar, emojiMap.IlluminateProgressBar);

    // Generate the embed
    return new EmbedBuilder()
        .setColor(0x1e90ff)
        .setTitle('🎯 Kill Quota Progress')
        .setDescription('Track progress towards eliminating enemy forces.')
        .addFields(
            { 
                name: `${emojiMap.terminid} Terminid Kills`, 
                value: `${terminidKills} / ${terminidGoal} (${Math.round((terminidKills / terminidGoal) * 100)}%)\n${terminidBar}`, 
                inline: false 
            },
            { 
                name: `${emojiMap.automaton} Automaton Kills`, 
                value: `${automatonKills} / ${automatonGoal} (${Math.round((automatonKills / automatonGoal) * 100)}%)\n${automatonBar}`, 
                inline: false 
            },
            { 
                name: `${emojiMap.illuminate} Illuminate Kills`, 
                value: `${illuminateKills} / ${illuminateGoal} (${Math.round((illuminateKills / illuminateGoal) * 100)}%)\n${illuminateBar}`, 
                inline: false 
            }
        )
        .setFooter({ text: 'High Command is watching...' })
        .setTimestamp();
}

module.exports = { generateKillQuotaGoalsEmbed };
