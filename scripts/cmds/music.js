const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "music",
        version: "2.0.6",
        author: "Shaan Khan",
        role: 0,
        shortDescription: "Download Audio or Video",
        longDescription: "YouTube se audio ya video download karne ke liye command.",
        category: "media",
        guide: "{pn} [song name] - Audio download karne ke liye\n{pn} [song name] video - Video download karne ke liye",
        countDown: 5
    },

    onStart: async function ({ api, event, args, message }) {
        const { threadID, messageID } = event;

        if (!args.length) return message.reply("❌ Naam likho.");

        let isVideo = false;
        let input = args.join(" ");
        if (input.toLowerCase().endsWith(" video")) {
            isVideo = true;
            input = input.slice(0, -6).trim();
        }

        const cacheDir = path.join(__dirname, "cache");
        const cachePath = path.join(cacheDir, `${Date.now()}.${isVideo ? "mp4" : "mp3"}`);
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

        const processingMsg = await message.reply("✅ Apki Request Jari Hai Please Wait...");

        try {
            const headers = { 
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
            };

            const searchRes = await axios.get("https://uzairrajputapis.qzz.io/api/search/youtube", { params: { q: input }, headers });
            const video = searchRes.data.result[0];
            if (!video) throw new Error("Kuch nahi mila!");

            const dlRes = await axios.post(
                isVideo 
                    ? "https://uzairrajputapis.qzz.io/api/downloader/youtube" 
                    : "https://uzairrajputapis.qzz.io/api/downloader/ytmp3", 
                { url: video.url }, 
                { headers }
            );

            const downloadUrl = isVideo ? dlRes.data.result.downloadUrl : dlRes.data.result.download_url;
            if (!downloadUrl) throw new Error("Download link nahi mila.");

            const writer = fs.createWriteStream(cachePath);
            const response = await axios({ url: downloadUrl, method: 'GET', responseType: 'stream', headers });

            await new Promise((resolve, reject) => {
                response.data.pipe(writer);
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            const typeLabel = isVideo ? "VIDEO" : "MUSIC";
            const infoMsg = `🖤 𝗧𝗶𝘁𝗹𝗲: ${video.title}\n👤 𝗔𝗿𝘁𝗶𝘀𝘁: ${video.channel || video.author?.name || 'Unknown'}\n\n»»𝑶𝑾𝑵𝑬𝑹««★™  »»𝑺𝑯𝑨𝑨𝑵 𝑲𝑯𝑨𝑵««🥀\n\n𝒀𝑬 𝑳𝑶 𝑩𝑨𝑩𝒀 𝑨𝑷𝑲𝑰 ${typeLabel} 👈`;

            if (isVideo) {
                await message.reply({ body: infoMsg, attachment: fs.createReadStream(cachePath) });
            } else {
                await message.reply(infoMsg);
                await message.reply({ attachment: fs.createReadStream(cachePath) });
            }

        } catch (error) {
            message.reply(`❌ Error: ${error.message}`);
        } finally {
            if (processingMsg && processingMsg.messageID) {
                api.unsendMessage(processingMsg.messageID).catch(() => {});
            }
            if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }
    }
};
