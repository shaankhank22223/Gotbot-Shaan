const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "help",
    version: "1.0.2",
    author: "Shaan Khan",
    role: 0,
    shortDescription: {
      en: "commands list"
    },
    longDescription: {
      en: "Shows the list of commands or detailed info of a specific command."
    },
    category: "system",
    guide: {
      en: "{p}help [command name | page | all]"
    },
    countDown: 1,
    // GoatBot me No Prefix ke liye is setting ko true kia jata hai:
    usePrefix: false
  },

  onStart: async function ({ api, event, args, message }) {
    const { commands } = global.GoatBot;
    const { threadID, messageID } = event;
    const prefix = global.GoatBot.config.prefix;

    // Command info lookup handler
    if (args[0] && args[0].toLowerCase() !== "all" && isNaN(args[0])) {
      const command = commands.get(args[0].toLowerCase());
      if (!command) return message.reply(`کمانڈ "${args[0]}" نہیں ملی!`);

      const config = command.config;
      const roleText = config.role === 0 ? "User" : config.role === 1 ? "Group Admin" : "Bot Admin";
      const usages = config.guide?.en || "";

      const moduleInfo = `─────[ ${config.name} ]──────\n\n` +
        `Usage: ${usages.replace(/{p}/g, prefix)}\n` +
        `Category: ${config.category}\n` +
        `Waiting time: ${config.countDown || 1} second(s)\n` +
        `Permission: ${roleText}\n` +
        `Description: ${config.longDescription?.en || config.shortDescription?.en || ""}\n\n` +
        `Module coded by ${config.author}`;

      const link = [
        "https://i.imgur.com/9JZobiR.jpeg",
        "https://i.imgur.com/G2msKfY.jpeg"
      ];
      const imgPath = __dirname + `/cache/help_info_${messageID}.jpg`;
      const callback = () => api.sendMessage({ body: moduleInfo, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);

      return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", callback);
    }

    // "help all" mode
    if (args[0] && args[0].toLowerCase() === "all") {
      var group = [], msg = "";
      for (const [name, cmd] of commands) {
        const cat = cmd.config.category || "uncategorized";
        let groupItem = group.find(item => item.group.toLowerCase() === cat.toLowerCase());
        if (!groupItem) {
          group.push({ group: cat.toLowerCase(), cmds: [name] });
        } else {
          groupItem.cmds.push(name);
        }
      }

      group.forEach(commandGroup => {
        msg += `☂︎ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} \n${commandGroup.cmds.join(' • ')}\n\n`;
      });

      try {
        const res = await axios.get('https://apikanna.maduka9.repl.co');
        let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
        let admID = "100016828397863";
        let imgPath = __dirname + `/cache/472_${messageID}.${ext}`;

        api.getUserInfo(parseInt(admID), (err, data) => {
          let firstname = "Admin";
          if (!err && data) {
            var obj = Object.keys(data);
            firstname = data[obj].name.replace("@", "");
          }

          let callback = function () {
            api.sendMessage({
              body: `𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁\n\n` + msg + `\nSpamming the bot are strictly prohibited\n\nTotal Commands: ${commands.size}\n\nFor All Cmds Type help2\n\nDeveloper:\n𝙺𝙸𝙽𝙶 𝚂𝙷𝙰𝙰𝙽`,
              mentions: [{ tag: firstname, id: admID, fromIndex: 0 }],
              attachment: fs.createReadStream(imgPath)
            }, threadID, (err, info) => {
              fs.unlinkSync(imgPath);
            }, messageID);
          };

          request(res.data.data).pipe(fs.createWriteStream(imgPath)).on("close", callback);
        });
      } catch (e) {
        return message.reply(`𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁\n\n` + msg + `\nTotal Commands: ${commands.size}\n\nDeveloper:\n𝙺𝙸𝙽𝙶 𝚂𝙷𝙰𝙰𝙽`);
      }
      return;
    }

    // Default Paginated Help
    const arrayInfo = Array.from(commands.keys()).sort();
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 10;
    const first = numberOfOnePage * page - numberOfOnePage;
    const helpView = arrayInfo.slice(first, first + numberOfOnePage);

    let msg = "";
    let i = first;
    for (let cmds of helpView) {
      msg += `「 ${++i} 」📂${prefix}${cmds}\n`;
    }

    const siu = `★𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁★`;
    const text = `\n𝐏𝐀𝐆𝐄 (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\nFor All Cmds Type Help2\n\n𝗠𝗮𝗱𝗲 𝗕𝘆: 𝚂𝙷𝙰𝙰𝙽 𝙿𝙰𝚃𝙷𝙰𝙽\n\n★᭄𝗖𝗿𝗲𝗱𝗶𝘁'𝘀  ཫ    ★𝐒𝐇𝐀𝐀𝐍 𝐊𝐇𝐀𝐍★`;

    var link = [
      "https://i.imgur.com/WW1nVy9.jpeg",
      "https://i.imgur.com/WW1nVy9.jpeg"
    ];

    const imgPath = __dirname + `/cache/help_page_${messageID}.jpg`;
    var callback = () => api.sendMessage({
      body: siu + "\n\n" + msg + text,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath), messageID);

    return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", () => callback());
  }
};
