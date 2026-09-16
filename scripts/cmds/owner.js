const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Mᴏʜᴀᴍᴍᴀᴅ Aᴋᴀsʜ",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : Mᴏʜᴀᴍᴍᴀᴅ Rᴏʙɪᴜʟ
│ 🧸 Nɪᴄᴋ       : Rᴏʙɪᴜʟ
│ 🎂 Aɢᴇ        : 23+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Sᴛᴜᴅᴇɴᴛ + Jᴏʙ
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : Pʀɪᴠᴀᴛᴇ
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : 𝐃𝐡𝐚𝐤𝐚 - 𝐆𝐚𝐳𝐢𝐩𝐮𝐫
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  : fb.com/61593362671395
│ 💬 Messenger: m.me/61593362671395
│ 📞 WhatsApp  : wa.me/+9660572754616
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/appvjvk.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
