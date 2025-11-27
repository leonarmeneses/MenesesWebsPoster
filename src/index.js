import express from 'express';
import cron from 'node-cron';
import { generatePostContent } from './services/ai.js';
import { postToFacebook } from './services/facebook.js';
import { getRandomImageFromDrive } from './services/drive.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

console.log("Starting Meneses Webs Facebook Auto-Poster Service...");

// --- CORE LOGIC ---
async function runPostCycle() {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Triggering post cycle...`);

    try {
        // 1. Get Image from Drive
        console.log("Fetching random image from Drive...");
        const image = await getRandomImageFromDrive();

        if (!image) {
            console.warn("No image found or error fetching. Proceeding with text only.");
        }

        // 2. Generate Content (with Vision if image exists)
        console.log("Generating content with AI...");
        const content = await generatePostContent(image ? image.buffer : null, image ? image.mimeType : null);

        if (!content) {
            console.error("Failed to generate content.");
            return { success: false, error: "AI Generation Failed" };
        }

        console.log(`Generated Content: "${content}"`);

        // 3. Post to Facebook
        console.log("Posting to Facebook...");
        const success = await postToFacebook(content, image);  // Pass entire image object

        if (success) {
            console.log("Cycle completed successfully.");
            return { success: true, message: "Posted successfully", content };
        } else {
            console.error("Failed to post to Facebook.");
            return { success: false, error: "Facebook Post Failed" };
        }

    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error: error.message };
    }
}

// --- SCHEDULER ---
// Schedule task to run every hour
cron.schedule('0 9,14,19 * * *', async () => {
    console.log("⏰ Cron job triggered.");
    await runPostCycle();
});

// --- WEB SERVER (For Manual Trigger) ---
app.get('/', (req, res) => {
    res.send('Meneses Webs Auto-Poster is running. Go to <a href="/trigger-post">/trigger-post</a> to force a post.');
});

app.get('/trigger-post', async (req, res) => {
    console.log("🚀 Manual trigger received via HTTP.");
    const result = await runPostCycle();

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
