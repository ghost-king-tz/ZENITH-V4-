const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        // Tuma video yenye caption ya alive
        await sock.sendMessage(chatId, {
            video: { url: 'https://files.catbox.moe/llqx5a.mp4' }, // au tumia link ya attachment
            caption: `
═══════════════
𝐙𝐄𝐍𝐈𝐓𝐇-𝐕𝟒: STATUS  [ ONLINE ]*
Version: ${settings.version}

🌟🔥 𝐏𝐎𝐖𝐄𝐑 𝐈𝐒 𝐔𝐍𝐋𝐈𝐌𝐈𝐓𝐄𝐃 🔥🌟
>别以为我很弱，但我隐藏了我的 评价🗿

𝐙𝐄𝐍𝐈𝐓𝐇-𝐕𝟒 Engine Is Alive now 👨‍💻
═══════════════
Type *.menu* To see all command 💣.
`
        }, { quoted: message });

        // Tuma audio/nyimbo kama PTT (voice note)
        await sock.sendMessage(chatId, {
            audio: { url: 'https://files.catbox.moe/jiszqy.mp3' },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'KING LION bot iko hewani!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
                               
