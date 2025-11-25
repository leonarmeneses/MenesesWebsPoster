import { google } from 'googleapis';
import dotenv from 'dotenv';
import stream from 'stream';

dotenv.config();

const drive = google.drive('v3');

// Initialize auth - using API Key for simplicity (Public Read)
// If folder is private, we would need Service Account, but User provided API Key.
const auth = process.env.GOOGLE_API_KEY || process.env.GOOGLE_DRIVE_API_KEY;

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

        // 2. Pick a random file
        const randomFile = files[Math.floor(Math.random() * files.length)];
        console.log(`Selected image: ${randomFile.name} (${randomFile.id})`);

        // 3. Download the file content as a buffer
        // Note: 'alt=media' with API Key only works for public files.
        // If this fails, we might need to use the webContentLink or a different auth method.

        const response = await drive.files.get({
            fileId: randomFile.id,
            alt: 'media',
            key: apiKey
        }, { responseType: 'arraybuffer' });

        // Generate public URL for the image - use thumbnail format for better Facebook compatibility
        const publicUrl = `https://drive.google.com/thumbnail?id=${randomFile.id}&sz=w1000`;

        return {
            buffer: Buffer.from(response.data),
            mimeType: randomFile.mimeType,
            name: randomFile.name,
            url: publicUrl,
            fileId: randomFile.id
        };

    } catch (error) {
        console.error("Error fetching image from Drive:", error.message);
        return null;
    }
}
