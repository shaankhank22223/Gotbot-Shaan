module.exports = {
    config: {
        name: "help2",
        version: "1.0.2",
        role: 0,
        author: "PetterSever",
        description: "Beginner's Guide To All Bot Commands (No Prefix)",
        category: "system",
        guide: {
            en: "[ commandName / pageNumber ]"
        },
        countDown: 7
    },

    langs: {
        en: {
            moduleInfo: "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 second(s)\n❯ Permission: %6\n\n» Module code by %7 «",
            user: "User",
            adminGroup: "Admin group",
            adminBot: "Admin bot"
        }
    },

    // Non-prefix trigger ke liye event listener
    onChat: async function ({ api, event, message, getLang }) {
        const { commands } = global.GoatBot;
        const { threadID, messageID, body } = event;

        if (!body || typeof body !== "string") return;

        const args = body.trim().split(/\s+/);
        const commandName = args[0].toLowerCase();

        // Check agar user "help2" type kare bina prefix ke
        if (commandName === "help2") {
            if (args[1] && commands.has(args[1].toLowerCase())) {
                const command = commands.get(args[1].toLowerCase());
                const roleText = command.config.role === 0 ? getLang("user") : (command.config.role === 1 ? getLang("adminGroup") : getLang("adminBot"));

                const infoMsg = getLang("moduleInfo",
                    command.config.name,
                    command.config.description || "No description",
                    `${command.config.name} ${command.config.guide?.en || ""}`,
                    command.config.category || "Uncategorized",
                    command.config.countDown || 0,
                    roleText,
                    command.config.author || "Unknown"
                );

                return message.reply(infoMsg);
            }
            // Execute main list output
            return this.onStart({ api, event, message, args: args.slice(1), getLang });
        }
    },

    // Standard call handle karne ke liye
    onStart: async function ({ message, args, getLang }) {
        const { commands } = global.GoatBot;
        const target = (args[0] || "").toLowerCase();

        // Agar kisi specific command ki detail mangi gayi ho
        if (target && commands.has(target)) {
            const command = commands.get(target);
            const roleText = command.config.role === 0 ? getLang("user") : (command.config.role === 1 ? getLang("adminGroup") : getLang("adminBot"));

            const infoMsg = getLang("moduleInfo",
                command.config.name,
                command.config.description || "No description",
                `${command.config.name} ${command.config.guide?.en || ""}`,
                command.config.category || "Uncategorized",
                command.config.countDown || 0,
                roleText,
                command.config.author || "Unknown"
            );

            return message.reply(infoMsg);
        }

        // Entire command list show kare bina prefix ke
        const arrayInfo = [];
        const page = parseInt(args[0]) || 1;
        const numberOfOnePage = 9999;
        let i = 0;
        let msg = "";

        for (const [name] of commands) {
            arrayInfo.push(`${name}❣️`);
        }

        arrayInfo.sort();

        const startSlice = numberOfOnePage * page - numberOfOnePage;
        i = startSlice;
        const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

        for (const item of returnArray) {
            msg += `『 ${++i} 』${item}\n`;
        }

        const siu = `╔━━❖❖💠❖❖━━╗\n 𝐒𝐇𝐀𝐀𝐍 𝐊𝐇𝐀𝐍 𝐀𝐥𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭\n╚━━❖❖💠❖❖━━╝`;
        const text = `\nPage (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})`;

        return message.reply(siu + "\n\n" + msg + text);
    }
};
