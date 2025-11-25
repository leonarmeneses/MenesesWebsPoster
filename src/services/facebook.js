import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

export async function postToFacebook(message, imageData) {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
        console.error("Missing Facebook credentials in .env");
        return false;
    }

    try {
        if (imageData && imageData.buffer) {
            // Upload photo with message directly
            const uploadUrl = `https://graph.facebook.com/v19.0/${pageId}/photos`;
            const uploadFormData = new FormData();
            uploadFormData.append('source', imageData.buffer, { filename: 'image.jpg' });
            uploadFormData.append('message', message);
            uploadFormData.append('access_token', accessToken);

            const uploadResponse = await axios.post(uploadUrl, uploadFormData, {
                headers: uploadFormData.getHeaders()
            });

            if (uploadResponse.data && uploadResponse.data.id) {
                console.log(`✅ Successfully posted photo to Facebook! Post ID: ${uploadResponse.data.id}`);
                return true;
            }
        } else {
            // Post Text Only - Try both feed and posts endpoints
            try {
                // First try with /feed endpoint
                const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
                const response = await axios.post(url, {
                    message: message,
                    access_token: accessToken
                });

                if (response.data && response.data.id) {
                    console.log(`✅ Successfully posted to Facebook! ID: ${response.data.id}`);
                    return true;
                }
            } catch (feedError) {
                // If feed fails, try with /posts endpoint (for business profiles)
                console.log("⚠️ Feed endpoint failed, trying posts endpoint...");
                const url = `https://graph.facebook.com/v19.0/${pageId}/posts`;
                const response = await axios.post(url, {
                    message: message,
                    access_token: accessToken
                });

                if (response.data && response.data.id) {
                    console.log(`✅ Successfully posted to Facebook! ID: ${response.data.id}`);
                    return true;
                }
            }
        }
    } catch (error) {
        console.error("❌ Error posting to Facebook:", error.response ? error.response.data : error.message);
        return false;
    }
}

    try {
        if (imageData && imageData.buffer) {
            // Two-step process for public photo posts on timeline

            // Step 1: Upload photo without publishing
            const uploadUrl = `https://graph.facebook.com/v19.0/${pageId}/photos?access_token=${accessToken}&published=false`;
            const uploadFormData = new FormData();
            uploadFormData.append('source', imageData.buffer, { filename: 'image.jpg' });

            const uploadResponse = await axios.post(uploadUrl, uploadFormData, {
                headers: uploadFormData.getHeaders()
            });

            const photoId = uploadResponse.data.id;
            console.log(`Photo uploaded with ID: ${photoId}`);

            // Step 2: Create a feed post with the photo
            const postUrl = `https://graph.facebook.com/v19.0/${pageId}/feed?access_token=${accessToken}`;
            const postData = {
                message: message,
                attached_media: [{ media_fbid: photoId }]
            };

            const postResponse = await axios.post(postUrl, postData);

            if (postResponse.data && postResponse.data.id) {
                console.log(`Successfully posted to Facebook feed! Post ID: ${postResponse.data.id}`);
                return true;
            }
        } else {
            // Post Text Only
            const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
            const response = await axios.post(url, {
                message: message,
                access_token: accessToken
            });

            if (response.data && response.data.id) {
                console.log(`Successfully posted to Facebook! ID: ${response.data.id}`);
                return true;
            }
        }
    } catch (error) {
        console.error("Error posting to Facebook:", error.response ? error.response.data : error.message);
        return false;
    }
}
