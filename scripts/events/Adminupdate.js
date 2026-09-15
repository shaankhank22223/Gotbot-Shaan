const fs = require("fs-extra");

module.exports = {
    config: {
        name: "adminUpdate",
        version: "1.0.1",
        author: "Shaan Khan",
        description: "Group updates aur logs handle karta hai"
    },

    onStart: async function () {
        // Initialization if needed
    },

    onEvent: async function ({ event, api, threadsData, usersData }) {
        const { author, threadID, logMessageType, logMessageData, logMessageBody } = event;
        if (!logMessageType || author == threadID) return;

        const iconPath = __dirname + "/cache/emoji.json";
        if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));

        try {
            let threadInfo = await threadsData.get(threadID) || {};

            switch (logMessageType) {
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT == "add_admin") {
                        api.sendMessage(`[⚜️] Breaking News [⚜️]\n» Dil Dehla Dene wali News ${logMessageData.TARGET_ID} Ko Admin Bana Diya Gaya😒👈🏻`, threadID);
                    }
                    else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                        api.sendMessage(`[⚜️] BreakinG News [⚜️]\n  • Bechare ko admin se remove Kardiya☹️ ${logMessageData.TARGET_ID}`, threadID);
                    }
                    break;
                }

                case "log:user-nickname": {
                    api.sendMessage(`[⚜️] Update [⚜️]\n» ${(logMessageData.nickname.length == 0) ? `TO REMOVE USER'S NAME ${logMessageData.participant_id}` : `FOR UPDATE USER'S nicknames ${logMessageData.participant_id} to : ${logMessageData.nickname}`}.`, threadID);
                    break;
                }

                case "log:thread-name": {
                    api.sendMessage(`[⚜️] UPDATE GROUP CODE [⚜️]\n» ${(logMessageData.name) ? `FOR UPDATE GROUP NAME OF SMALL: ${logMessageData.name}` : 'TO REMOVE GROUP NAME'}.`, threadID);
                    break;
                }

                case "log:thread-icon": {
                    let preIcon = JSON.parse(fs.readFileSync(iconPath));
                    let newIcon = logMessageData.thread_icon || "🤦🏻‍♂";
                    
                    api.sendMessage(`[⚜️] Aj ki Taaza Khabar [⚜️]\n»  ${(logMessageBody || "").replace("emoticon", "icon")}\n» Original Icons: ${preIcon[threadID] || "unclear"}`, threadID, async (error, info) => {
                        preIcon[threadID] = newIcon;
                        fs.writeFileSync(iconPath, JSON.stringify(preIcon, null, 2));
                        
                        // Auto unsend 10 sec
                        setTimeout(() => {
                            if (info && info.messageID) api.unsendMessage(info.messageID);
                        }, 10000);
                    });
                    break;
                }

                case "log:thread-call": {
                    if (logMessageData.event == "group_call_started") {
                        const name = await usersData.getName(logMessageData.caller_id);
                        api.sendMessage(`❯❯❯⭑𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ⭑❮❮❮\n᯽ــــــــــــــــــــــــــــــــــــــ᯽\n⎯ⷨ͢⟵͇̽💗⃪꯭ⷯ༆⁂𝄄❘⍣ 【＿${name} ＿】 ⎯᪵⎯꯭̽𝆺꯭𝅥🌿꯭.\n᯽ــــــــــــــــــــــــــــــــــــــ᯽\n ⭑｟𝐒𝐓𝐀𝐑𝐓𝐄𝐃 𝐀 ${(logMessageData.video) ? '𝐕𝐈𝐃𝐄𝐎｠⭑ ' : ''}𝐂𝐀𝐋𝐋｠⭑`, threadID);
                    }
                    else if (logMessageData.event == "group_call_ended") {
                        const callDuration = logMessageData.call_duration;

                        let hours = Math.floor(callDuration / 3600);
                        let minutes = Math.floor((callDuration - (hours * 3600)) / 60);
                        let seconds = callDuration - (hours * 3600) - (minutes * 60);

                        if (hours < 10) hours = "0" + hours;
                        if (minutes < 10) minutes = "0" + minutes;
                        if (seconds < 10) seconds = "0" + seconds;

                        const timeFormat = `${hours}:${minutes}:${seconds}`;
                        api.sendMessage(`❯❯❯⭑𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ⭑❮❮❮\n» ${(logMessageData.video) ? '𝐕𝐈𝐃𝐄𝐎 ' : ''}CALL HAS ENDED.\n» CALL DURATION: ${timeFormat}`, threadID);
                    }
                    else if (logMessageData.joining_user) {
                        const name = await usersData.getName(logMessageData.joining_user);
                        api.sendMessage(`❯❯❯⭑𝐆𝐑𝐎𝐔𝐏 𝐔𝐏𝐃𝐀𝐓𝐄 ⭑❮❮❮\n᯽ــــــــــــــــــــــــــــــــــــــ᯽\n⎯ⷨ͢⟵͇̽💗⃪꯭ⷯ༆⁂𝄄❘⍣ 【＿${name} ＿】 ⎯᪵⎯꯭̽𝆺꯭𝅥🌿꯭.\n᯽ــــــــــــــــــــــــــــــــــــــ᯽\n⭑｟𝐉𝐎𝐈𝐍𝐄𝐃 𝐓𝐇𝐄 ${(logMessageData.group_call_type == '1') ? '𝐕𝐈𝐃𝐄𝐎｠⭑ ' : ''}𝐂𝐀𝐋𝐋｠⭑`, threadID);
                    }
                    break;
                }

                case "log:magic-words": {
                    return api.sendMessage(`[⚜️] Theme ${logMessageData.magic_word} added effects: ${logMessageData.theme_name}\n[⚜️] Emoij: ${logMessageData.emoji_effect || "No emoji"}\n[⚜️] Total ${logMessageData.new_magic_word_count} word effects added`, threadID);
                }

                case "log:thread-poll": {
                    if (logMessageData.event_type == "question_creation" || logMessageData.event_type == "update_vote") {
                        return api.sendMessage(`${logMessageBody}`, threadID);
                    }
                    break;
                }

                case "log:thread-approval-mode": {
                    return api.sendMessage(logMessageBody, threadID);
                }

                case "log:thread-color": {
                    api.sendMessage(`[⚜️] UPDATE GROUP CODE [⚜️]\n» ${(logMessageBody || "").replace("Topic", "color")}`, threadID, async (error, info) => {
                        setTimeout(() => {
                            if (info && info.messageID) api.unsendMessage(info.messageID);
                        }, 10000);
                    });
                    break;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
};
