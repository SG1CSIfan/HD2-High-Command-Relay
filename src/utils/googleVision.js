const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

// Sorts OCR text regions by top-to-bottom (Y-coordinate) and left-to-right (X-coordinate)
function sortTextData(textData) {
    return textData.sort((a, b) => {
        const yDiff = a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y;
        if (Math.abs(yDiff) < 10) {
            // If Y-coordinates are close, sort by X-coordinate
            return a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x;
        }
        return yDiff;
    });
}

function extractStat(text, regex) {
    const match = text.match(regex);
    if (match) {
        console.log(`[DEBUG] Matched ${regex}:`, match[1]);
    } else {
        console.warn(`[WARN] No match for ${regex}`);
    }
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}

async function analyzeImage(imageUrl) {
    try {
        const [result] = await client.textDetection(imageUrl);
        const annotations = result.textAnnotations || [];
        if (annotations.length === 0) {
            throw new Error('No text found in the image.');
        }

        // Log raw OCR text for debugging
        // console.log('[DEBUG] Raw OCR Text:', annotations[0]?.description || 'No text found');

        // Sort text regions left-to-right, top-to-bottom
        const sortedData = sortTextData(annotations.slice(1));
        const joinedDescriptions = sortedData.map(item => item.description).join(' ');

        // Log the sorted and joined text for debugging
        // console.log('[DEBUG] Sorted and Joined Text:', joinedDescriptions);

        // Extract stats using updated regex patterns
        const stats = {
            enemyKills: extractStat(joinedDescriptions, /Enemy Kills\s+([\d,]+)/i),
            terminidKills: extractStat(joinedDescriptions, /Terminid Kills\s+([\d,]+)/i),
            automatonKills: extractStat(joinedDescriptions, /Automaton Kills\s+([\d,]+)/i),
            illuminateKills: extractStat(joinedDescriptions, /Illuminate Kills\s+([\d,]+)/i),
            friendlyKills: extractStat(joinedDescriptions, /Friendly Kills\s+([\d,]+)/i),
            deaths: extractStat(joinedDescriptions, /Deaths\s+([\d,]+)/i),
            shotsFired: extractStat(joinedDescriptions, /Shots Fired\s+([\d,]+)/i),
            shotsHit: extractStat(joinedDescriptions, /Shots Hit\s+([\d,]+)/i),
        };

        // Log extracted stats for debugging
        // console.log('[DEBUG] Extracted Stats:', stats);

        return stats;
    } catch (error) {
        console.error('[ERROR] Failed to analyze image with Google Vision:', error);
        throw error; // Propagate error for handling in the command
    }
}

function extractStat(text, regex) {
    const multilineRegex = new RegExp(regex.source.replace(/\s+/g, '\\s*'), regex.flags); // Allow multiline matching
    const match = text.match(multilineRegex);
    if (match) {
        console.log(`[DEBUG] Matched ${regex}:`, match[1]);
    } else {
        console.warn(`[WARN] No match for ${regex}`);
    }
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}

module.exports = { analyzeImage };
