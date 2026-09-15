const { existsSync, mkdirSync, createReadStream, readdirSync } = require("fs-extra");
const { join } = require("path");

module.exports = {
    config: {
        name: "joinNoti",
        version: "1.0.1",
        author: "CatalizCS (Modified for GOATBOT)",
        countDown: 5,
        role: 0,
        description: "Group join hone par notification aur random media bhejne ke liye",
        category: "events"
    },

    onLoad: async function () {
        const path = join(__dirname, "cache", "joinGif");
        if (!existsSync(path)) mkdirSync(path, { recursive: true });

        const path2 = join(__dirname, "cache", "joinGif", "randomgif");
        if (!existsSync(path2)) mkdirSync(path2, { recursive: true });
    },

    onStart: async function ({ api, event, threadsData }) {
        if (event.logMessageType !== "log:subscribe") return;

        const { threadID } = event;
        const prefix = global.GoatBot.config.prefix || "/";
        const botName = global.GoatBot.config.botName || "Bot";

        // Jab Bot Khud Kisi Group Mein Add Ho
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
            api.changeNickname(`{ ${prefix} } × ${botName}`, threadID, api.getCurrentUserID());

            const welcomeMsg = "Assalamu Alaikum Everyone🥀🥀";
            const attachmentPath = join(__dirname, "cache", "Botjoin.mp4");

            const mediaInfo = {
                body: `🌺Shaan🦋🌺 CONNECTED«\n\nBot Made By SHAAN KHAN K☘️\n<------------------------------>\nBOT CONNECTED SUCCESSFUL !!!\n\nAPPROVAL ALLOW IN THIS GROUP!!!\n<------------------------------>\n\nUSE HELP TO SEE COMMAND\n\nUse ${prefix}help to see commands.\n\nexample :\n${prefix}video7 (video songs)\n${prefix}music (audio songs)\n${prefix}help2 (command list)\n${prefix}info\n<<<<<------------------------------>>>>>\nAND FOR ANY REPORT OR CONTACT BOT DEVELOPER\n\nOWNER: 𝐒𝐇𝐀𝐀𝐍\n\n♻️Facebook:\nhttps://www.facebook.com/profile.php?id=100016828397863&mibextid=ZbWKwL\n\nYoutube Site : N/A\n\n☢️ INSTAGRAM: N/A\nhttps://www.instagram.com/shankhank345?igsh=MXVneXZ6bzR4bHhvcg==\n\n☣️Email: shankhank345@gmail.com\n\n⚠️Wp: +92 3368783346`
            };

            if (existsSync(attachmentPath)) {
                mediaInfo.attachment = createReadStream(attachmentPath);
            }

            return api.sendMessage(welcomeMsg, threadID, () => {
                api.sendMessage(mediaInfo, threadID);
            });
        } 
        // Jab Koi Naya Member Group Mein Join Ho
        else {
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const { threadName, participantIDs } = threadInfo;

                const threadData = await threadsData.get(threadID) || {};
                const path = join(__dirname, "cache", "joinGif");
                const pathGif = join(path, `${threadID}.gif`);

                let mentions = [];
                let nameArray = [];
                let memLength = [];
                let i = 0;

                for (let id in event.logMessageData.addedParticipants) {
                    const userName = event.logMessageData.addedParticipants[id].fullName;
                    nameArray.push(userName);
                    mentions.push({ tag: userName, id: event.logMessageData.addedParticipants[id].userFbId });
                    memLength.push(participantIDs.length - i++);
                }
                memLength.sort((a, b) => a - b);

                let msg = (typeof threadData.customJoin == "undefined" || !threadData.customJoin) 
                    ? "𝐖𝐞𝐥𝐜𝐨𝐦𝐞   𝐓𝐨  𝐒𝐡𝐚𝐚𝐧  𝐊𝐡𝐚𝐧  𝐁𝐨𝐭  😇● ========================= ●\n● ======= 𝐇𝐄𝐋𝐋𝐎 𝐁𝐀𝐁𝐘 ======= ●\n● ========================= ●\n\n● ==== 🆆 🅴🅻🅻 🅲🅾🅼 🅴 ==== ●\n\n● ========= 𝐍𝐄𝐖 ========= ●\n\n● ==== 🇲‌ 🇪‌ 🇲‌ 🇧‌ 🇪‌ 🇷‌ ==== ●\n\n● ========================= ● [   {name} ]\n● ========================= ●\n● ====== 𝐌𝐘 𝐆𝐑𝐎𝐔𝐏 ===== ●\n\n{threadName}\n\n● = 🥀 𝐇𝐀𝐏𝐏𝐘 𝐄𝐍𝐉𝐎𝐘 🥀 = ●\n\n● == 🥀 𝐌𝐀𝐉𝐄 𝐊𝐀𝐑𝐎 🥀  == ●\n● ========================= ● 𝐎𝐑 𝐓𝐔𝐌 𝐈𝐒 𝐆𝐑𝐎𝐔𝐏 𝐊𝐄  {soThanhVien} 𝐌𝐄𝐌𝐁𝐀𝐑 𝐇𝐎 𝐄𝐍𝐉𝐎𝐘 𝐊𝐀𝐑𝐎 𝐌𝐀𝐉𝐄 𝐋𝐎 [ . ] ● ========================= ●\n\n● ========================= ●\n● ======= 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐓𝐨 ====== ●\n\n☟  ========== ☟ ==========  ☟\n\n=𝐎𝐰𝐧𝐞𝐫 ➻    🌹 𝐒𝐡𝐚𝐚𝐧 𝐊𝐡𝐚𝐧 𝐊 🌹\n● ========================= ●" 
                    : threadData.customJoin;

                msg = msg
                    .replace(/\{name}/g, nameArray.join(', '))
                    .replace(/\{type}/g, (memLength.length > 1) ? 'You' : 'Friend')
                    .replace(/\{soThanhVien}/g, memLength.join(', '))
                    .replace(/\{threadName}/g, threadName || "Group");

                let formPush = { body: msg, mentions };

                const randomFolderPath = join(__dirname, "cache", "joinGif", "randomgif");
                const randomPath = existsSync(randomFolderPath) ? readdirSync(random
