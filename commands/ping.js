module.exports = {
    name: "ping",
    description: "Test if the bot is alive",
    async execute(sock, msg, args, settings) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: "🏓 Pong! Bot iko live ✅" });
    }
};
