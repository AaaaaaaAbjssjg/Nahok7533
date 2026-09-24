const axios = require("axios");

const mahmud = [
    "baby",
    "bby",
    "babu",
    "bbu",
    "jan",
    "bot",
    "জান",
    "জানু",
    "বেবি",
    "wifey",
    "hina",
    "বট",
];

const baseApiUrl = async () => {
    const base = await axios.get("https://raw.githubusercontent.com/mahmud-aura/HINATA/main/baseApiUrl.json");
    return base.data.mahmud;
};

module.exports.config = {
    name: "baby",
    aliases: ["bby", "bbu", "jan", "janu", "wifey", "robot", "hinata", "hina"],
    version: "4.7",
    author: "MahMUD",
    countDown: 0,
    role: 0,
    description: "better than all sim simi and most fastest",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist [all / pageNumber] OR\nedit [YourMessage] - [NeWMessage]\nNote: better than all sim simi and most fastest"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }
    
    const rawMsg = args.join(" ");
    const msg = rawMsg.toLowerCase();
    const uid = event.senderID;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "I love you", "type !bby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === "teach") {
            const mahmud = rawMsg.replace(/^teach\s+/i, "");
            const [trigger, ...responsesArr] = mahmud.split(" - ");
            const responses = responsesArr.join(" - ");
            if (!trigger || !responses) return api.sendMessage("❌ | teach [question] - [response1, response2,...]", event.threadID, event.messageID);
            const response = await axios.post(`${await baseApiUrl()}/api/teach`, { trigger, responses, userID: uid });
            const userName = (await usersData.getName(parseInt(uid, 10))) || "Unknown User";
            return api.sendMessage(`✅ Replies added: "${responses}" to "${trigger}"\n• 𝐓𝐞𝐚𝐜𝐡𝐞𝐫: ${userName}\n• 𝐓𝐨𝐭𝐚𝐥: ${response.data.count || 0}`, event.threadID, event.messageID);
        }

        if (args[0] === "remove" || args[0] === "rm") {
            const mahmud = rawMsg.replace(/^(remove|rm)\s+/i, "");
            const [trigger, index] = mahmud.split(" - ");
            if (!trigger || !index || isNaN(index)) return api.sendMessage("❌ | remove [question] - [index]", event.threadID, event.messageID);
            const response = await axios.delete(`${await baseApiUrl()}/api/teach/remove`, { data: { trigger, index: parseInt(index, 10) }, });
            return api.sendMessage(response.data.message, event.threadID, event.messageID);
        }

        if (args[0] === "list") {
            const isAll = args[1] === "all" || !isNaN(args[1]);
            const endpoint = isAll ? "/list/all" : "/list";
            const response = await axios.get(`${await baseApiUrl()}/api/teach${endpoint}`);             
            if (!isAll) return api.sendMessage(response.data.message, event.threadID, event.messageID); let page = parseInt(!isNaN(args[1]) ? args[1] : args[2], 10) || 1;
            const limit = 100; const rawData = response.data.data; const teachers = [];
            for (const userID of Object.keys(rawData)) { let name = "Unknown";  try { name = (await usersData.getName(parseInt(userID, 10))) || "Unknown";  } catch (e) {
            console.error(`getName failed for userID ${userID}:`, e.message); }
            teachers.push({ name, value: rawData[userID] });
         }

            teachers.sort((a, b) => b.value - a.value);
            const totalPages = Math.ceil(teachers.length / limit) || 1;            
            if (page < 1) page = 1; if (page > totalPages) page = totalPages; const start = (page - 1) * limit;
            const paginatedData = teachers.slice(start, start + limit);
            let message = "👑 List of Baby teachers:\n\n";
            for (let i = 0; i < paginatedData.length; i++) { const t = paginatedData[i]; const num = String(start + i + 1).padEnd(3);
            message += `${num}. ${t.name}: ${t.value}\n`; }            
            message += `\n• Total page: [${page}/${totalPages}]`; message += `\n• Total Teacher: ${teachers.length}`; message += `\n• type !baby list all ${page < totalPages ? page + 1 : page} and see next page`;            
            return api.sendMessage(message, event.threadID, event.messageID);
        }

        if (args[0] === "edit") {
            const mahmud = rawMsg.replace(/^edit\s+/i, "");
            const [oldTrigger, ...newArr] = mahmud.split(" - ");
            const newResponse = newArr.join(" - ");
            if (!oldTrigger || !newResponse) return api.sendMessage("❌ | Format: edit [question] - [newResponse]", event.threadID, event.messageID);
            await axios.put(`${await baseApiUrl()}/api/teach/edit`, { oldTrigger, newResponse });
            return api.sendMessage(`✅ Edited "${oldTrigger}" to "${newResponse}"`, event.threadID, event.messageID);
        }

        if (args[0] === "message" || args[0] === "msg") {
            const searchTrigger = args.slice(1).join(" ");
            if (!searchTrigger) return api.sendMessage("Please provide a message to search.", event.threadID, event.messageID); try {
            const response = await axios.get(`${await baseApiUrl()}/api/teach/msg`, { params: { userMessage: `msg ${searchTrigger}` } });
            return api.sendMessage(response.data.message || "No message found.", event.threadID, event.messageID);
          } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "error";
            return api.sendMessage(errorMessage, event.threadID, event.messageID);
            }
        }

        const attachments = event.attachments || [];
        const response = (await axios.post(`${await baseApiUrl()}/api/baby?text=${encodeURIComponent(msg)}&font=3`, { attachments })).data.reply;

        return api.sendMessage(response, event.threadID, (err, info) => {
            if (!err) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    text: response
                });
            }
        }, event.messageID);

    } catch (err) {
        console.error(err);
        api.sendMessage(`${err.response?.data || err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    if (event.type !== "message_reply") return;
    try {
        const text = event.body?.toLowerCase() || "";
        const attachments = event.attachments || [];
        const response = (await axios.post(`${await baseApiUrl()}/api/baby?text=${encodeURIComponent(text)}&font=3`, { attachments })).data.reply;

        api.sendMessage(response, event.threadID, (err, info) => {
            if (!err) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    text: response
                });
            }
        }, event.messageID);
    } catch (err) {
        console.error(err);
    }
};

module.exports.onChat = async ({ api, event }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const hasTrigger = mahmud.some(word => body.startsWith(word));

        if (event.type !== "message_reply" && hasTrigger) {
            api.setMessageReaction("🪽", event.messageID, () => {}, true);

            const text = body.replace(/^\S+\s*/, "");
            const attachments = event.attachments || [];

            const randomMessage = [
                "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",
                "থাপ্পড় চিনোস থাপ্পড়- 👋👋😡 -চিন্তা করিস না তরে মারমু না-🤗 -বস রবিউল আমারে মারছে - 🥱 - উফফ সেই স্বাদ..!🥵🤤💦",
                "আমাকে ডেকো না আমি বস রবিউল এর সাথে বিজি আছি",
                "hmmm এখানে না ইনে নক দাও জান",
                "-সর তুই গরীব তোর সাথে কথা নাই",
                "ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস 𝐑𝐨𝐛𝐢𝐮𝐥এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻https://www.facebook.com/share/1Hy5unzXjR/",
                "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
                "কি গো সোনা আমাকে ডাকছ কেনো",
                "বার বার আমাকে ডাকস কেন😡",
                "আহ শোনা আবার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
                "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
                "আমাকে এতো না ডেকে বস রবিউলকে একটা গফ দে",
                "উফ্স এত ডাকলে left নিবো😡",
                "jang hanga korba",
                "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস 𝐑𝐨𝐛𝐢𝐮𝐥 এর সাথে  প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗",
                "আমাকে ডাকছো কেন কিছু বলবা আমাই🙋‍♀️",
                "তুই এত ডাকিস বলেই বস রবিউল আমাই আমার সাতে রাগ করে",
                "Sorry I have boyfriend😏😏",
                "তোর জন্য একটু শাক্তি মত মেকাপ করতি পারি নাহ এত ডাকিস কেন বল কি বলবি",
                "আমি চোখে দেখি না আমি অন্ধ ওর Inbox নিয়ে চলো একটু",
                "-বাসর রাতে দু'ধ খায় কেন-!!:🫰🙈🥵",
                "মাদক মুক্ত সমাজ চাও🥰হে🥲তা হলে ছলনাময়ী নারীর,,!👰‍♀️ফাসি দাও...!❌",
                "💜🔐🌈 This About line”-!!🙃✨‘”✨🦋-!)☺️:সময় বদলায় কিন্তু কিছুঅনুভূতি বদলায় না!°-°>!✨🌸💙🍒🖇️",
                "★তুমি্ সা্ফল্য্ খুঁজে্ নাও্..! ★★__ভা্লো্বা্সা্ তো্মা্কে্ খুঁজে্ নি্বে্★",
                "♡ ওৃঁই জাৃঁনে মাৃঁনৃঁ তুৃঁই ৃশুৃঁধুৃঁ আৃঁমাৃঁরৃঁ⎯͢⎯⃝🥰🫵🌸🌼","♡︎𝐋𝐢𝐟𝐞 𝐈𝐬 𝐁𝐞𝐚𝐮𝐭𝐢𝐟𝐮𝐥 𝐈𝐟 𝐘𝐨𝐮 𝐃𝐨𝐧,𝐭 𝐅𝐚𝐥𝐥 𝐈𝐧 𝐋𝐨𝐯𝐞",
                "খোদা একটা মন দিলো,কিন্তু মনের মানুষ দিলো না...রে!🤧",
                "মানুষ মুগ্ধ হয় চেহারায় ;আর আমি মুগ্ধ হয়েছি তার মায়ায়..!😊🌸",
                "🎤চোরি চোরি দিল তেরা চুরায়েঙ্গে..!🖤🙈🎧- ধীরে ধীরে তেরা আম্মুকো শাশুরী বানায়েঙ্গে-!!🥴🦋",
                "তুমি এমন এক ফুল মায়াবতী- যে ফোটার আগে'ই তারে পাওয়ার লোভে বিদ্রোহ করে প্রজাপতি।",
                "-এই খানে মন রাখছিলাম কে  নিছস ক😡🔪",
                "-বড় হয়ে তোমাকে বিয়ে করবো!ok🙂🫵",
                "খুব!বেশি!না!!আমি!অল্পতে ই!অনেক খুশি💚🌻🙂🌸মিথ্যে ভালোবাসা!নয়!আমি!প্রকৃত!ভালোবাসা র!স্বপ্ন!দেখি🌺🖤•💚🍒---",
                "●───༉༆🌸☺সিহ ইউ নট ফর মাইন্ডヅ-ডু ইউ লাভ মি!!-🙄🙊 ヅ🤦‍♀️●───༆🤦‍♀️ তেমন কিছু বলি নাই ❞🥴🥱💔_দেখলাম তুমি পড়তে পারো কিনা 🙊🤦‍♀️🤦‍♀️😒",
                "✤⋆⃝🐻𝄞'-তুঁ খি্ঁচ্ঁ মে্ঁরি্ঁ ফ্ঁটো্ঁ-'𝄞🐰⋆⃝✤┈•",
                "-⎯͢⎯⃝এ'ড'মি'নে'র' E'x এ'র অ'লি'তে' গ'লি'তে' উ'ম্মা'হ'-🥺⎯͢⎯⃝🩷🍒",
                "যাও পাখি বলো তারে🕊️~~~সে যেন আমার বস রবিউল ইন বক্সে এ মেসেজ করে...!😌🙄আর যদি মেসেজ না  করে তাহলে যেনো পানিতে ডুবে মরে... 🐸🥴😆🤭",
                "এত Bot Bot না ডেকে  𝐀𝐝𝐦𝐢𝐧 বইলা আমাই  𝐀𝐝𝐦𝐢𝐧  নিয়ে দাও প্রিয়ো সবাইকে কিক দিয়ে আমি আর তুমি থাকবো 🤣😂",
                "ఌ︎_____🍒💚🌺♡︎••🌼 𝐚𝐛𝐨𝐮𝐭 𝐭𝐡𝐢𝐬 𝐥𝐢𝐧𝐞🙂🌿__🖤🦋দিন শেষে সূর্যটাও বুঝিয়ে দেয় সময় শেষ হলে স্থাঁন পরিবর্তন হয়!!🥰",
                "-কি হলো ,মিস টিস করচ্ছিস নাকি🤣😂",
                "ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস 𝐑𝐨𝐛𝐢𝐮𝐥এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻https://www.facebook.com/share/1Hy5unzXjR/",
                "ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস 𝐑𝐨𝐛𝐢𝐮𝐥এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻https://www.facebook.com/share/1Hy5unzXjR/",
                "Facebook  এমন একটা গ্রহ!!!!যেখানে হালকা sad Caption post  করলে ---- এলিয়েন রা ভাবে ছ্যাকা খাইছে!!",
                "Facebook আমাকে কিছুই দেয়নি.!🥹শুধু কে!ড়ে নিয়েছে আমার হাজারো MB.!😞",
                "ফেসবুক মনে হয় আমারে তাবিজ করছে!😒 হুদাই আসি অনলাইনে একটু পর পর!🤥🙂🙄",
                "___😽🌹 l Wish এ'ই Facebook থেকে❥一 কোনো এক দিন যে কোনাে এক'টা༉💚🥰মেয়ে  কে  বস রবিউল এর জন্য নিয়া দৌড় দি'মু🏃‍♀️ 🏃‍♂️🙈😇😁 ইনশাআল্লাহ 😆😆",
                "🐸🐸🐸__𝐌𝐲  𝐯𝐨𝐢𝐜𝐞 🌚▶︎•||।||।।||।||।।|||।||।। 0:26-ওহ  𝐬𝐨𝐫𝐫𝐲  তুই শুনবি কেমনে তুই তো ফ্রী 𝐟𝐚𝐜𝐞𝐛𝐨𝐨𝐤   ইউজার🥴🐸",
                "༊═══❥বাবু ডিনার করছো ༊᭄༊᭄বলার কেউ নেই ༊᭄❥┼─༊🙃🙂❗😒༆᭄̲̲̲̞̎̎͢༊═══ তাই ডিনার করি না༊᭄༊᭄༊᭄༊᭄রাতে খেয়ে❥┼─দেয়ে༊ 🥴😳🦋༆᭄̲̲̲̞̎̎͢༊═══❥ঘুমিয়ে পরি ༊🍁🤧",
                "-এ”༎༅জীবন༎তোমাকে😍দিলাম”༎༅”বন্ধু🥰🥀-তুমি༎༅শুধু༎༅আইডির༎༅༎༅পার্সওয়াডটা ༎༅দিও😘",
                "⎯⃝♡ও্ঁই্ঁ তো্ঁরে্ঁ🫵 লু্ঁচ্চা্ঁমি্ঁ ⎯⃝♡সি্ঁখা্ঁই্ঁছে্ঁ ⎯͢কে্ঁডা্ঁ রে্ঁ🤣⎯⃝",
                "❥𒊹︎─༊ আজ আম্মুকে বলেছিলাম “বিরিয়ানি খাবো”🙂❥┼─༊আম্মু শুনেছে “বিরি খাবো। 🙄༊᭄●══ ❥তারপর শুরু হলো থাপড়ানি..😤😠❥┼─༊⌢  এখন আমি ডান কানে কম শুনি..🙂🙂",
                "༊❤️প্রিয়༊🥀🌺༊”কাল”༊🦋🥀༊’যদি’༊’না’༊’ফিরি’༊’নতুন’༊’ভোরে’🖤シ︎🌸🖤🥀🌺༊’তাহলে’বুঝে°নিয়ো অনেক^বেশি ঘুমাই গিয়েছিলাম🤣😁…",
                "আমাকে ডাকলে আমি কিন্তূ কিস করে দেবো দৌড় দিমু🏃‍♀️😘",
                "য°খ°নি° প°ড়ে°ছে  ন°জ°র° 🐼💫                                      Next Line.... 🎤",
                "গুরুপে একটা ছেলেকে ভাল্লাগে😔",
                "খালি অন্যের bf রে ভাল্লাগে-🍒",
                "i love you jaan",
                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘",
                "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, রবিউল ,রবিউল ও তো করতে পারো😑?",
                "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
                "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
                "হটাৎ আমাকে মনে পড়লো 🙄",
                "Bot বলে অসম্মান করচ্ছিছ,😰😿",
                "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
                "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
                "খাওয়া দাওয়া করসো 🙄",
                "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
                "আরে আমি মজা করার mood এ নাই😒",
                "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
                "আরে Bolo আমার জান, কেমন আসো? 😚",
                "একটা BF খুঁজে দাও 😿",
                "oi mama ar dakis na pilis 😿",
                "amr JaNu lagbe,Tumi ki single aso?",
                "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
                "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
                "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
                "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
                "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে"
            ];

            if (!text && attachments.length === 0) {
                const babyMessage = randomMessage[Math.floor(Math.random() * randomMessage.length)];
                return await api.sendMessage(babyMessage, event.threadID, (err, info) => {
                    if (!err) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: module.exports.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID,
                            text: babyMessage
                        });
                    }
                }, event.messageID);
            }

            const response = (await axios.post(`${await baseApiUrl()}/api/baby?text=${encodeURIComponent(text)}&font=3`, { attachments })).data.reply;

            return await api.sendMessage(response, event.threadID, (err, info) => {
                if (!err) {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: module.exports.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID,
                        text: response
                    });
                }
            }, event.messageID);
        }
    } catch (err) {
        console.error(err);
    }
};
