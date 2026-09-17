const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function getApiBase() {
  try {
    const GITHUB_RAW = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json";
    const res = await axios.get(GITHUB_RAW);
    return res.data.saimx69x;
  } catch (e) {
    console.error("GitHub raw fetch error:", e.message);
    return null;
  }
}

async function toFont(text, id = 21) {
  try {
    const apiBase = await getApiBase();
    if (!apiBase) return text;
    const apiUrl = `${apiBase}/api/font?id=${id}&text=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);
    return data.output || text;
  } catch (e) {
    console.error("Font API error:", e.message);
    return text;
  }
}

// Urdu Love Poetry Collection
const urduPoetry = [
  "تیری چاہت میں بکھرنے کی خواہش ہے،\nتیرے ساتھ ہی تو سنورنے کی خواہش ہے۔ ✨🌹",
  "دل تو صرف ایک ہی تھا،\nجو ہم نے تیرے نام کر دیا۔ 💖✨",
  "تم سے جو رابطہ بنا ہے نا،\nوہ کوئی اتفاق نہیں، مقدر ہے ہمارا۔ 💞🕊️",
  "تیرے بغیر جی نہیں لگتا،\nتم ہی تو میری ہر خوشی کا سبب ہو۔ 🌷💘",
  "باتیں تو بہت ہیں کہنے کو،\nپر تم مسکرا دو تو سب مکمل لگتا ہے۔ ✨🌸",
  "میری ہر دعا کا اثر ہو تم،\nکاش ہمیشہ کے لیے میرے ہو تم۔ 🌹💫"
];

module.exports = {
  config: {
    name: "pair",
    aliases: ["lovepair", "match"],
    author: "Shaan Khan",
    version: "2.0",
    role: 0,
    category: "love",
    shortDescription: { en: "💘 Generate a love match between you and another group member" },
    longDescription: { en: "This command calculates a love match based on gender. Shows avatars, background, and love percentage with Urdu poetry." },
    guide: { en: "{p}{n} — Use this command in a group to find a love match" }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const senderData = await usersData.get(event.senderID);
      let senderName = senderData.name;

      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData.userInfo;

      const myData = users.find(user => user.id === event.senderID);
      if (!myData || !myData.gender) return api.sendMessage("⚠️ Could not determine your gender. Please try again later.", event.threadID, event.messageID);

      const myGender = myData.gender.toUpperCase();
      let matchCandidates = [];

      if (myGender === "MALE") matchCandidates = users.filter(user => user.gender === "FEMALE" && user.id !== event.senderID);
      else if (myGender === "FEMALE") matchCandidates = users.filter(user => user.gender === "MALE" && user.id !== event.senderID);
      else return api.sendMessage("⚠️ Your gender is undefined. Cannot find a match. Please try again later.", event.threadID, event.messageID);

      if (matchCandidates.length === 0) return api.sendMessage("❌ No suitable match found in the group. Please try again later.", event.threadID, event.messageID);

      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      let matchName = selectedMatch.name;

      senderName = await toFont(senderName, 21);
      matchName = await toFont(matchName, 21);

      const avatar1 = `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatar2 = `https://graph.facebook.com/${selectedMatch.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const apiBase = await getApiBase();
      if (!apiBase) return api.sendMessage("❌ Failed to fetch API base. Please try again later.", event.threadID, event.messageID);

      const apiUrl = `${apiBase}/api/pair?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}`;
      const outputPath = path.join(__dirname, "pair_output.png");

      const imageRes = await axios.get(apiUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(outputPath, Buffer.from(imageRes.data, "binary"));

      const lovePercent = Math.floor(Math.random() * 31) + 70;
      
      // Random Urdu poetry select karne ke liye
      const randomPoetry = urduPoetry[Math.floor(Math.random() * urduPoetry.length)];

      const message = `💞 𝗠𝗮𝘁𝗰𝗵𝗺𝗮𝗸𝗶𝗻𝗴 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲 💞

🎀 ${senderName} ✨️
🎀 ${matchName} ✨️

🕊️ ${randomPoetry}

💘 𝙲𝚘𝚖𝚙𝚊𝚝𝚒𝚋𝚒𝚕𝚒𝚝𝚢: ${lovePercent}% 💘`;

      api.sendMessage(
        { body: message, attachment: fs.createReadStream(outputPath) },
        event.threadID,
        () => fs.unlinkSync(outputPath),
        event.messageID
      );

    } catch (error) {
      api.sendMessage("❌ An error occurred while trying to find a match. Please try again later.", event.threadID, event.messageID);
    }
  }
};
