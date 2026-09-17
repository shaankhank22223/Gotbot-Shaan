const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "meme",
    version: "1.0.0",
    author: "Mr Shaan",
    countDown: 1,
    role: 0,
    shortDescription: {
      en: "Chaeyoung Pictures."
    },
    longDescription: {
      en: "Sends random pictures of Chaeyoung."
    },
    category: "image",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    var link = [
      "https://i.imgur.com/2YpLtS7.jpeg",
      "https://i.imgur.com/2U6ZsLI.jpeg"
    ];

    var callback = () => api.sendMessage({
      body: `😂𝐒𝐇𝐀𝐀𝐍 𝐄𝐃𝐈𝐓𝐎𝐑😂 \nNumber of photos available: ${link.length}`,
      attachment: fs.createReadStream(__dirname + "/cache/5.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.jpg"));

    return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
      .pipe(fs.createWriteStream(__dirname + "/cache/5.jpg"))
      .on("close", () => callback());
  }
};
