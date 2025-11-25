import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function debugToken() {
    const token = process.env.FACEBOOK_ACCESS_TOKEN;

    try {
        // Check token info
        const response = await axios.get(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
        console.log("Token Info:", response.data);

        // Check permissions
        const perms = await axios.get(`https://graph.facebook.com/v19.0/me/permissions?access_token=${token}`);
        console.log("\nPermissions:", perms.data);

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

debugToken();
