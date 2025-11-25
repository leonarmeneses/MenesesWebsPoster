import { generatePostContent } from './services/ai.js';
import { postToFacebook } from './services/facebook.js';
import { getRandomImageFromDrive } from './services/drive.js';
import dotenv from 'dotenv';

dotenv.config();

async function runManualTest() {
    console.log("🚀 Starting Manual Test Run...");

    try {
        // 1. Get Image from Drive
        console.log("📂 Fetching random image from Drive...");
        const image = await getRandomImageFromDrive();

        if (!image) {
            console.warn("⚠️ No image found or error fetching. Proceeding with text only.");
        } else {
            console.log(`✅ Image found: ${image.name}`);
        }

        // 2. Generate Content (with Vision if image exists)
        console.log("🧠 Generating content with AI (Vision)...");
        const content = await generatePostContent(image ? image.buffer : null, image ? image.mimeType : null);

        if (!content) {
            console.error("❌ Failed to generate content.");
            return;
        }

        console.log(`📝 Generated Content:\n---\n${content}\n---`);

        // 3. Post to Facebook
        console.log("bie Posting to Facebook...");
        const success = await postToFacebook(content, image ? image.buffer : null);

        if (success) {
            console.log("✅ Test completed successfully! Check your Facebook Page.");
        } else {
            console.error("❌ Failed to post to Facebook.");
        }

    } catch (error) {
        console.error("❌ Unexpected error:", error);
    }
}

runManualTest();
