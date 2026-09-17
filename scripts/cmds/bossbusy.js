module.exports = {
  config: {
    name: "bossbusy",
    version: "1.1.0",
    author: "Rakib",
    countDown: 0,
    role: 0,
    shortDescription: "Boss busy funny alert",
    longDescription: "বসের UID মেনশন করলে বট ফানি রিপ্লাই দেবে",
    category: "no prefix",
    guide: ""
  },

  onStart: async function ({ api, event, args, message, getLang }) {},

  onReply: async function ({ api, event, Reply, message }) {
    if (event.senderID !== Reply.author) return;
    message.reply(`You replied: ${event.body}`);
  },

  onReaction: async function ({ api, event, Reaction, message }) {
    message.reply(`You reacted with: ${event.reaction}`);
  },

  onChat: async function ({ api, event, message }) {
    // আপনার দেওয়া ইউআইডি (UID) সমূহ
    const bossUIDs = ["61593362671395", "502799434"];

    // ৭টি ফানি মেসেজের লিস্ট
    const funnyReplies = [
      "আমার বস এখন ব্যস্ত আছে! অযথাই ওনাকে না ডেকে পারলে একটা গার্লফ্রেন্ড এনে দাও! 😜",
      "বস ব্যস্ত আছেন! অযথা ডেকে লাভ নাই, পারলে ওনার জন্য একটা সুন্দর ক্রাশ পাঠাও! 😂",
      "বস কাজে ডুবে আছেন! ডেকে ডিস্টার্ব না করে পারলে একটা প্রেমের প্রস্তাব নিয়ে আসেন! 💍",
      "বসকে ডেকে লাভ নেই, উনি বিজি! পারলে তার জন্য একটা কিউট জিএফ স্পন্সর করেন! 😉",
      "বস এখন খুবই বিজি! খোঁচা না মেরে ওনার জন্য একটা ভালো গার্লফ্রেন্ড খুঁজে দেন! 😝",
      "বস ব্যস্ত! ওনাকে না ডেকে এক কাপ চা আর একটা গার্লফ্রেন্ড উপহার দিলে খুশি হবেন! ☕",
      "বস কাজের সাগরে ভাসছেন! ওনাকে ডিস্টার্ব না করে একটা সিরিয়াস প্রেমিকা জোগাড় করে দিন! 🤪"
    ];

    // মেনশন চেক করা হচ্ছে
    if (event.mentions) {
      const mentionedIDs = Object.keys(event.mentions);
      const isBossMentioned = bossUIDs.some(uid => mentionedIDs.includes(uid));

      if (isBossMentioned) {
        // র‍্যান্ডমলি যেকোনো একটি মেসেজ সিলেক্ট করে উত্তর দেবে
        const randomReply = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
        message.reply(randomReply);
      }
    }
  },

  onEvent: async function ({ api, event, message }) {
    if (event.logMessageType === "log:subscribe") {
      message.reply("Welcome!");
    }
  }
};
