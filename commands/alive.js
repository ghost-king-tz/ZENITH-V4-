module.exports = {
    name: "alive",
    description: "Angalia kama bot iko hai",
    async execute(sock, msg, args, settings) {
        const from = msg.key.remoteJid;

        const aliveMessage = `
🤖 *${settings.botName}* iko online na inafanya kazi vizuri ✅

📌 Prefix: ${settings.prefix}
👑 Owner: ${settings.ownerNumber}

_Tumia ${settings.prefix}menu kuona commands zote._
        `;

        await sock.sendMessage(from, { text: aliveMessage });
    }
};
