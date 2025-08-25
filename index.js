const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const P = require("pino");
const fs = require("fs");
const { Boom } = require("@hapi/boom");
const settings = require("./settings.js");

// Load all commands from /commands
const commands = new Map();
fs.readdirSync("./commands").forEach(file => {
    if (file.endsWith(".js")) {
        const command = require(`./commands/${file}`);
        commands.set(command.name, command);
    }
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(settings.sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })),
        },
        browser: [settings.botName, "Chrome", "1.0.0"],
    });

    // Save creds automatically
    sock.ev.on("creds.update", saveCreds);

    // Connection status
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log(`✅ ${settings.botName} imeunganishwa kama: ${sock.user.id}`);
        }

        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log("❌ Connection closed:", reason);
            if (reason !== DisconnectReason.loggedOut) {
                startBot();
            }
        }

        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode(settings.ownerNumber);
            console.log(`👉 Pairing Code kwa namba ${settings.ownerNumber}: ${code}`);
        }
    });

    // Kusikiliza messages
    sock.ev.on("messages.upsert", async (msgUpdate) => {
        const msg = msgUpdate.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        if (!body.startsWith(settings.prefix)) return;

        const args = body.slice(settings.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName);
        if (command) {
            try {
                await command.execute(sock, msg, args, settings);
            } catch (err) {
                console.error(err);
                await sock.sendMessage(from, { text: "⚠️ Kulikuwa na error kwenye command hii." });
            }
        }
    });
}

startBot();
