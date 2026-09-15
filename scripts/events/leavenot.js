const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "leave",
    version: "1.0.0",
    author: "Priyansh Rajput (Adapted for GoatBot)",
    countDown: 5,
    role: 0,
    shortDescription: "Leave notification event",
    longDescription: "Notify when a user leaves or is kicked from the group",
    category: "events"
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    // Agar bot khud leave kare toh ignore kare
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    const { threadID } = event;
    const leftID = event.logMessageData.leftParticipantFbId;

    // Time and Session Logic
    const time = moment.tz("Asia/Karachi").format("DD/MM/YYYY || HH:mm:ss");
    const hours = parseInt(moment.tz("Asia/Karachi").format("HH"));
    
    let session = "Night";
    if (hours <= 10) session = "𝙈𝙤𝙧𝙣𝙞𝙣𝙜";
    else if (hours > 10 && hours <= 12) session = "𝘼𝙛𝙩𝙚𝙧𝙉𝙤𝙤𝙣";
    else if (hours > 12 && hours <= 18) session = "𝙀𝙫𝙚𝙣𝙞𝙣𝙜";

    // Get User and Thread Info
    const userName = await usersData.getName(leftID);
    const threadData = await threadsData.get(threadID);
    const customLeave = threadData.data?.customLeave;

    const type = (event.author == leftID) ? "khud leave kiya" : "kisi ne nikal diya";

    // Message Text Construct
    let msg = customLeave || "💐𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐒𝐇𝐀𝐀𝐍 𝐁𝐎𝐓 𝐌𝐄𝐑𝐈 𝐉𝐀𝐀𝐍💐😇👈\n──────────────\n\n {name} \n\n──────────────\n𝐊𝐎 𝐁𝐇𝐆𝐀 𝐃𝐈𝐘𝐀🌝 \n──────────────────\n {type} \n──────────────\n𝐎𝐰𝐧𝐞𝐫 ➻  ──── 💐 𝐒𝐇𝐀𝐀𝐍 💐\n──────────────\n {name} \n──────────────\n 💐💐𝐊𝐈𝐓𝐍𝐀 𝐂𝐔𝐓𝐄 𝐓𝐇𝐀 𝐍𝐀 𝐘𝐄𝐇💐💐😥 ✨✨ 𝐆𝐑𝐎𝐔𝐏 𝐒𝐄 𝐂𝐇𝐀𝐋𝐀 𝐆𝐀𝐘𝐀 ♥ 𝐀𝐁 𝐌𝐄𝐑𝐀 𝐈𝐒𝐊𝐄 𝐁𝐈𝐍𝐀 𝐊𝐀𝐈𝐒𝐄 𝐌𝐀𝐍 𝐋𝐀𝐆𝐄𝐆𝐀🤔🤔\n──────────────\n\n[❤️‍🔥] 🖤🖤😥😥...Good {session} || {time}";

    msg = msg
      .replace(/\{name}/g, userName)
      .replace(/\{type}/g, type)
      .replace(/\{session}/g, session)
      .replace(/\{time}/g, time);

    // Media Folder Pathing
    const folderPath = path.join(__dirname, "cache", "leaveGif", "randomgif");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const randomFiles = fs.readdirSync(folderPath);
    let attachment = [];

    if (randomFiles.length > 0) {
      const randomFile = randomFiles[Math.floor(Math.random() * randomFiles.length)];
      const filePath = path.join(folderPath, randomFile);
      attachment.push(fs.createReadStream(filePath));
    }

    return api.sendMessage({ body: msg, attachment }, threadID);
  }
};
