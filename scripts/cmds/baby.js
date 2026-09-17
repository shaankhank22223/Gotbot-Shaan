module.exports.config = {
    name: "bot",
    aliases: ["bby", "baby"],
    version: "2.1",
    author: "Shaan Khan",
    countDown: 0,
    role: 0,
    description: "Random bot reply module with custom layout",
    category: "chat",
    guide: { en: "{pn}" }
};

module.exports.onStart = async ({ api, event }) => {
    return api.sendMessage("𝗢𝘄𝗻𝗲𝗿 : 𝗦𝗵𝗮𝗮𝗻 𝗞𝗵𝗮𝗻", event.threadID, event.messageID);
};

module.exports.onChat = async ({ api, event, usersData }) => {
    try {
        if (!event.body) return;

        // "Bot" ya "bot" se start hone vale messages match karne ke liye logic
        if (event.body.indexOf("Bot") === 0 || event.body.indexOf("bot") === 0) {
            const uid = event.senderID;
            const name = (await usersData.getName(uid)) || "User";

            const tl = [
                "TUM MERE BOSS SH𝖠𝖠𝖭 KI GF BAN JAO LDKI🙈🙈",
                "baraye meherbani holad kijiye apke call ufone numaindey ko mili ja rahi hai😂😂😂😁",
                "haiy ma sadky jawa teri masoom shaqal py 😂 chabal insan",
                "Bot nah bol oye ! Janu bol mjhy aur janu sy piyar sy bat kerty hai , rat ko kahan thy nazar nahi ay hawali py 😂",
                "Shaqal Sy masoom lgty ho 😂 btao kahi Ap ka ghar doup main to nahi",
                "kash tum single hoty to maza hi koch aur tha pagal insane 😂",
                "Ha ha ab meri yaad ab ai nah phly to babu shona kerna gy thy 😾 ab ham ap sy naraz hai jao ap bye ☹️",
                "haiy babu ny boliya hai shaid purpose kerna hai mjhy bolo bolo babu 😘",
                "Ary ghreeb awam roti banana ky liya athy main Pani ko istamal kerty ho 😂",
                "Ary chabli nah mar joh kam hai bol do sharma nahi , bol de koi nahi dakh rha 😂",
                "Hy Ma Mar Jawa Babu Ak Chuma To Doo Kafi Din Sy Chumi Nahi Mili Kahan Thy Babu inbox Ah Ja 😂",
                "Dur Dur Fity Muh Aur Koi Kam Nahi Kiya Har Waqat Mjhy Tang Kerta Rhta Ha 😂",
                "ary ary bolo meri jaan kia hail hai ;) ;*",
                "Tum aunty ho yehh uncle 🤔 I think tum Jin ho yehh Chudail"
            ];

            const rand = tl[Math.floor(Math.random() * tl.length)];

            var msg = {
                body: `💞👉${name} 💞👈\n\n❖•S━━━━━💞━━━━━K•❖,\n\n\n${rand}                                        \n\n𝑪𝒓𝒆𝒅𝒊𝒕𝒔:𒁍≛⃝𝑺𝑯𝑨𝑨𝑵 𝑲𝑯𝑨𝑵 𝑲 ❥||ㅎ\n\n❖•S━━━━━💞━━━━━K•❖`,
                mentions: [{ tag: name, id: uid }]
            };

            return api.sendMessage(msg, event.threadID, event.messageID);
        }
    } catch (err) {
        console.error(err);
    }
};
