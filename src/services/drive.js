import { google } from 'googleapis';
import dotenv from 'dotenv';
import stream from 'stream';

dotenv.config();

const drive = google.drive('v3');

// Initialize auth - using API Key for simplicity (Public Read)
// If folder is private, we would need Service Account, but User provided API Key.
const auth = process.env.GOOGLE_API_KEY || process.env.GOOGLE_DRIVE_API_KEY;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE = path.join(__dirname, '../../history.json');

export async function getRandomImageFromDrive() {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

        if (!folderId || !apiKey) {
            console.error("Missing Google Drive credentials.");
            return null;
        }

        // 1. List files in the folder
        const res = await drive.files.list({
            q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
            fields: 'files(id, name, mimeType)',
            key: apiKey
        });

        const files = res.data.files;
        if (!files || files.length === 0) {
            console.error("No images found in Drive folder.");
            return null;
        }

        // --- DUPLICATE PREVENTION LOGIC ---
        let history = [];
        try {
            if (fs.existsSync(HISTORY_FILE)) {
                history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
            }
        } catch (err) {
            console.error("Error reading history file:", err);
        }

        // Filter out images that are in history
        const availableFiles = files.filter(f => !history.includes(f.id));

        let selectedFile;

        if (availableFiles.length === 0) {
            console.log("⚠️ All images have been used recently. Resetting history to avoid stalling.");
            selectedFile = files[Math.floor(Math.random() * files.length)];
            history = []; // Reset history
        } else {
            selectedFile = availableFiles[Math.floor(Math.random() * availableFiles.length)];
        }

        console.log(`Selected image: ${selectedFile.name} (${selectedFile.id})`);

        // Update History
        history.push(selectedFile.id);
        if (history.length > 20) history.shift(); // Keep only last 20
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        // ----------------------------------

        // 3. Download the file content as a buffer
        // Note: 'alt=media' with API Key only works for public files.
        // If this fails, we might need to use the webContentLink or a different auth method.

        const response = await drive.files.get({
            fileId: selectedFile.id,
            alt: 'media',
            key: apiKey
        }, { responseType: 'arraybuffer' });

        // Generate public URL for the image - use thumbnail format for better Facebook compatibility
        const publicUrl = `https://drive.google.com/thumbnail?id=${selectedFile.id}&sz=w1000`;

        return {
            buffer: Buffer.from(response.data),
            mimeType: selectedFile.mimeType,
            name: selectedFile.name,
            url: publicUrl,
            fileId: selectedFile.id
        };

    } catch (error) {
        console.error("Error fetching image from Drive:", error.message);
        return null;
    }
}
