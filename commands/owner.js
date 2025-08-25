module.exports = {
    name: "owner",
    description: "Onyesha namba ya owner",
    async execute(sock, msg, args, settings) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: `👑 Owner: ${settings.ownerNumber}` });
    }
};
