/**
 * Generates a progress bar string for Discord embeds using custom emojis.
 *
 * @param {number} current - The current value.
 * @param {number} goal - The goal value.
 * @param {string} filledEmoji - Emoji for the filled portion of the bar.
 * @param {string} backgroundEmoji - Emoji for the background (empty portion).
 * @param {number} length - Total number of segments in the progress bar (default: 20).
 * @returns {string} - The generated progress bar string.
 */
function generateProgressBar(current, goal, filledEmoji, backgroundEmoji, length = 20) {
    const progress = Math.min(current / goal, 1); // Cap at 100%
    const filledBars = Math.round(progress * length);
    const emptyBars = length - filledBars;

    // If progress is 100%, fully fill the bar
    if (progress === 1) {
        return filledEmoji.repeat(length);
    }

    // Partial fill with background and filled emojis
    return `${filledEmoji.repeat(filledBars || 1)}${backgroundEmoji.repeat(emptyBars || 1)}`;
}

module.exports = { generateProgressBar };