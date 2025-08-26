module.exports = {
    name: "owner",
    description: "show owner phone number",
    async execute(sock, msg, args, settings) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: `👑 Owner: ${settings.ownerNumber}` });
    }
};
