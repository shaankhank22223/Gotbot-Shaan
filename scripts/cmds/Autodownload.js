const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "linkAutoDownload",
    version: "1.5.0",
    role: 0,
    author: "Shaan Babu",
    description: "Downloads video automatically from valid links and shows original title.",
    category: "media",
    guide: {
      en: "Just send any valid video link (https://...)"
    },
    countDowns: 5
  },

  onLoad: function () {
    const filePath = __filename;
    const fileData = fs.readFileSync(filePath, "utf8");

    if (!fileData.includes('author: "Shaan Babu"')) {
      console.log("\n❌ ERROR: Credits Badle Gaye Hain! File Disabled ❌\n");
      process.exit(1);
    }
  },

  onStart: async function () {
    // Command trigger hone par run hota hai
  },

  onChat: async function ({ api, event }) {
    const { alldown } = require("arif-babu-downloader");

    const body = (event.body || "").trim();
    if (!body.startsWith("https://")) return;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const data = await alldown(body);

      if (!data || !data.data || !data.data.high) {
        return api.sendMessage("❌ Valid download link not found.", event.threadID, event.messageID);
      }

      const videoTitle = data.data.title || data.title || "No Title Found";
      const videoURL = data.data.high;
      const cacheDir = path.join(__dirname, "cache");
      
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `auto_${event.senderID}_${Date.now()}.mp4`);

      const response = await axios.get(videoURL, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return api.sendMessage(
        {
          body: `✨❁ ━━ ━[ 𝐎𝐖𝐍𝐄𝐑 ]━ ━━ ❁✨\n\nᴛɪᴛʟᴇ: ${videoTitle}\n\n✨❁ ━━ ━[ 𝑺𝑯𝑨𝑨𝑵 ]━ ━━ ❁✨`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        event.messageID
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
