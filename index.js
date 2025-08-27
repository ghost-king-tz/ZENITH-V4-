const { WAConnection, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const startBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const conn = new WAConnection();

    conn.version = [2, 2140, 12];
    conn.authState = state;

    conn.on('open', () => {
        console.log('Bot is connected!');
        saveCreds();
    });

    conn.on('close', async ({ reason }) => {
        if (reason === DisconnectReason.loggedOut) {
            console.log('Logged out, please re-register.');
            return;
        }
        console.log('Connection lost, reconnecting...');
        await startBot();
    });

    conn.on('chat-update', async (chatUpdate) => {
        if (!chatUpdate.hasNewMessage) return;
        const message = chatUpdate.messages.all()[0];
        if (!message.key.fromMe && message.message) {
            const commandPrefix = message.message.conversation.startsWith('.') ? '.' : '!';
            const command = message.message.conversation.slice(1).trim();
            handleCommand(command, message);
        }
    });

    conn.on('qr', (qr) => {
        console.log('Scan this QR code to register: ', qr);
    });

    await conn.connect();
    loadCommands();
};

const loadCommands = () => {
    const commandsDir = path.join(__dirname, 'commands');
    fs.readdir(commandsDir, (err, files) => {
        if (err) return console.error('Error loading commands:', err);
        files.forEach(file => {
            if (file.endsWith('.js')) {
                require(path.join(commandsDir, file));
            }
        });
    });
};

const handleCommand = (command, message) => {
    // Command handling logic goes here
    // Example: if (command === 'hello') { conn.sendMessage(message.key.remoteJid, 'Hello there!'); }
};

startBot().catch(err => console.error('Error starting bot:', err));
