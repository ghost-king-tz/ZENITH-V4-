const settings = require('../settings.js');

async function pingCommand(sock, chatId, message) {
    try {
        // Hesabu matumizi ya ping na uptime
        const start = Date.now();
        await sock.sendMessage(chatId, { text: 'Pong!' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);
        const uptimeInSeconds = process.uptime();
        const hours = Math.floor(uptimeInSeconds / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeInSeconds % 60);
        const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

        // CAPTION ya ping kama jedwali
        const videoCaption = `
───────────────
*𝐙𝐄𝐍𝐈𝐓𝐇-𝐕𝟒: SYSTEM PING*
───────────────
> Status: ONLINE 🎃
> Ping: ${ping} ms ⚡
> Uptime: ${uptimeFormatted} ⏱️
> Version: ${settings.version || '1.0.0'}
> Mode: PUBLIC 👥
───────────────
いつも一人ぼっち🔥✏️。
───────────────
        `.trim();

        // Tuma video na caption
        await sock.sendMessage(chatId, {
            video: { url:'https://files.catbox.moe/bt5gb6.mp4' },
            caption: videoCaption
        }, { quoted: message });

        // Tuma audio/nyimbo
        await sock.sendMessage(chatId, {
            audio: { url: 'https://files.catbox.moe/g6y8qe.mp3' },
            mimetype: 'audio/mp3',
            ptt: true
        }, { quoted: message });

    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: ' 𝐙𝐄𝐍𝐈𝐓𝐇-𝐕𝟒 ping .' });
    }
}

module.exports = pingCommand
