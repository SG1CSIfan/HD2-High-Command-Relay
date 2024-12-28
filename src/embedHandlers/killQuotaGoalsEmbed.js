const fsPromises = require('fs/promises');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const emojiMap = require('../utils/emojiMapLoader');
const { generateProgressBar } = require('../utils/progressBar');

const PERSISTENT_FILE = path.resolve(__dirname, '../data/persistentMessage.json');

async function generateKillQuotaGoalsEmbed(totals, goals, channel) {
    const data = JSON.parse(await fsPromises.readFile(PERSISTENT_FILE, 'utf8'));

    const terminidKills = parseInt(totals.terminidKills, 10) || 0;
    const automatonKills = parseInt(totals.automatonKills, 10) || 0;
    const illuminateKills = parseInt(totals.illuminateKills, 10) || 0;

    const terminidGoal = goals.terminidGoal || 1;
    const automatonGoal = goals.automatonGoal || 1;
    const illuminateGoal = goals.illuminateGoal || 1;

    const previousTerminidMet = data.killQuota.terminidMet || false;
    const previousAutomatonMet = data.killQuota.automatonMet || false;
    const previousIlluminateMet = data.killQuota.illuminateMet || false;
    const previousAllGoalsMet = data.killQuota.allGoalsMet || false;

    data.killQuota.terminidMet = terminidKills >= terminidGoal;
    data.killQuota.automatonMet = automatonKills >= automatonGoal;
    data.killQuota.illuminateMet = illuminateKills >= illuminateGoal;
    data.killQuota.allGoalsMet =
        data.killQuota.terminidMet &&
        data.killQuota.automatonMet &&
        data.killQuota.illuminateMet;

    // Save updated data
    await fsPromises.writeFile(PERSISTENT_FILE, JSON.stringify(data, null, 2));

    // Send messages for individual goals
    const timestamp = `<t:${Math.floor(Date.now() / 1000)}:F>`;
    if (data.killQuota.terminidMet && !previousTerminidMet) {
        await channel.send(`${emojiMap.terminid} **Terminid Quota Met!** Goal: ${terminidGoal} kills on ${timestamp}!`);
    }
    if (data.killQuota.automatonMet && !previousAutomatonMet) {
        await channel.send(`${emojiMap.automaton} **Automaton Quota Met!** Goal: ${automatonGoal} kills on ${timestamp}!`);
    }
    if (data.killQuota.illuminateMet && !previousIlluminateMet) {
        await channel.send(`${emojiMap.illuminate} **Illuminate Quota Met!** Goal: ${illuminateGoal} kills on ${timestamp}!`);
    }

    // Send message for all goals met
    if (data.killQuota.allGoalsMet && !previousAllGoalsMet) {
        const finalMessage = `🪖 **MISSION ACCOMPLISHED!** 🪖\n\n🎉 **All Kill Quotas Have Been Met** on ${timestamp}!\n\n🌟 **High Command Commends Your Bravery!** 🌟\n\nGoals will be updated soon. Stay ready, Helldivers!`;
        await channel.send(finalMessage);
    }

    // Progress bars
    const terminidBar = generateProgressBar(
        terminidKills,
        terminidGoal,
        emojiMap.HelldiverProgressBar,
        emojiMap.TerminidProgressBar
    );

    const automatonBar = generateProgressBar(
        automatonKills,
        automatonGoal,
        emojiMap.HelldiverProgressBar,
        emojiMap.AutomationProgressBar
    );

    const illuminateBar = generateProgressBar(
        illuminateKills,
        illuminateGoal,
        emojiMap.HelldiverProgressBar,
        emojiMap.IlluminateProgressBar
    );

    // Generate the embed
    const embed = new EmbedBuilder()
        .setColor(0x1e90ff)
        .setTitle('🎯 Kill Quota Progress')
        .setDescription('Track progress towards eliminating enemy forces.')
        .addFields(
            {
                name: `${emojiMap.terminid} Terminid Kills`,
                value: `${terminidKills} / ${terminidGoal} (${Math.round(
                    (terminidKills / terminidGoal) * 100
                )}%)\n${terminidBar}`,
                inline: false,
            },
            {
                name: `${emojiMap.automaton} Automaton Kills`,
                value: `${automatonKills} / ${automatonGoal} (${Math.round(
                    (automatonKills / automatonGoal) * 100
                )}%)\n${automatonBar}`,
                inline: false,
            },
            {
                name: `${emojiMap.illuminate} Illuminate Kills`,
                value: `${illuminateKills} / ${illuminateGoal} (${Math.round(
                    (illuminateKills / illuminateGoal) * 100
                )}%)\n${illuminateBar}`,
                inline: false,
            }
        )
        .setFooter({ text: 'High Command is watching...' })
        .setTimestamp();

    return embed;
}

module.exports = { generateKillQuotaGoalsEmbed };
