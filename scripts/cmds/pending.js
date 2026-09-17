module.exports = {
    config: {
        name: "pending",
        version: "2.0.0",
        author: "𝐒𝐇𝐀𝐀𝐍 𝐊𝐇𝐀𝐍 𝐊",
        role: 2, // Admin only
        shortDescription: {
            vi: "Quản lý hàng chờ",
            en: "Manage bot's waiting threads"
        },
        longDescription: {
            vi: "Duyệt hoặc từ chối các nhóm đang chờ",
            en: "Approve or refuse pending threads"
        },
        category: "system",
        guide: {
            en: " [reply number] or [c/cancel number]"
        }
    },

    // No-Prefix trigger key (Jab koi "pending" likhega to command trigger ho jayegi)
    onStart: async function ({ api, event, args, message }) {
        const { threadID, messageID } = event;
        let msg = "", index = 1;

        let spam = [], pending = [];
        try {
            spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        } catch (e) {
            return message.reply("Can't get the pending list!");
        }

        const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

        for (const single of list) {
            msg += `${index++}/ ${single.name} (${single.threadID})\n`;
        }

        if (list.length !== 0) {
            return message.reply(
                `»「PENDING」«❮ The whole number of threads to approve is: ${list.length} thread ❯\n\n${msg}\n\n👉 Reply numbers to approve, or reply "c <number>" to cancel.`,
                (err, info) => {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        pending: list
                    });
                }
            );
        } else {
            return message.reply("「PENDING」Shaan Koi Pending List Nahi Hai");
        }
    },

    // Executed without prefix keyword matching
    onChat: async function ({ event, message }) {
        if (event.body && event.body.toLowerCase() === "pending") {
            this.onStart({ api: global.api, event, args: [], message });
        }
    },

    onReply: async function ({ api, event, Reply, message }) {
        const { author, pending } = Reply;
        if (String(event.senderID) !== String(author)) return;

        const { body } = event;
        let count = 0;

        if (isNaN(body) && (body.indexOf("c") === 0 || body.indexOf("cancel") === 0)) {
            const index = body.slice(body.indexOf("c") === 0 ? 1 : 6).trim().split(/\s+/);
            for (const singleIndex of index) {
                if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > pending.length) {
                    return message.reply(`${singleIndex} is not a valid number!`);
                }
                await api.removeUserFromGroup(api.getCurrentUserID(), pending[singleIndex - 1].threadID);
                count++;
            }
            return message.reply(`Refused ${count} thread(s)!`);
        } else {
            const index = body.trim().split(/\s+/);
            for (const singleIndex of index) {
                if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > pending.length) {
                    return message.reply(`${singleIndex} is not a valid number!`);
                }
                await api.sendMessage(
                    "𝐒𝐇𝐀𝐀𝐍 𝐁𝐎𝐒𝐒 𝐍𝐄 𝐀𝐏𝐏𝐑𝐎𝐕𝐄 𝐃𝐄 𝐃𝐈𝐘𝐀 𝐀𝐏𝐊𝐄 𝐆𝐑𝐎𝐔𝐏 𝐊𝐎 𝐀𝐁 𝐌𝐀𝐙𝐘 𝐊𝐀𝐑𝐎 𝐄𝐍𝐉𝐎𝐘 𝐊𝐀𝐑𝐎 𝐁𝐎𝐓 𝐉𝐀𝐍𝐔 𝐊𝐎🥀!\nuse [.]help for more info :>",
                    pending[singleIndex - 1].threadID
                );
                count++;
            }
            return message.reply(`Approved successfully ${count} thread(s)!`);
        }
    }
};
