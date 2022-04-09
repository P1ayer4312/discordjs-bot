const {
    Client,
    Intents
} = require('discord.js');

const {
    randomIntFromInterval,
    reactWith,
    toDiscordChars,
    localTime
} = require('./custom_modules/essentials');

const {
    token
} = require('./config.json');

const {
    emotes,
    helpEmbed
} = require('./customData.json');

const {
    impersonate,
    impData
} = require('./custom_modules/impersonate');

const spotifyFunc = require('./custom_modules/spotifyPlaylist');

const {
    rnFunc,
    rollFunc
} = require('./custom_modules/roll&rnFunc');

const StatusWrapper = require('./custom_modules/statusFunc');
const musicParse = require('./custom_modules/ytMusic_TTS');
const fetchRandomQuote = require('./custom_modules/motivation');

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.once('ready', () => {
    console.log('Ready!');
    StatusWrapper.init(client).resetDefault();
});

client.on('messageCreate', async msg => {
    if (msg.content.startsWith('!')) {
        const cmd = msg.content
            .substring(1) // Izbrishi cmdTriggerChar
            .split(' ');
        const date = new Date();
        let temp;
        let cmdLen = cmd[0].length + 2;
        // console.log(msg.content);
        switch (cmd[0]) {
            case 'roll':
                temp = rollFunc(cmd);
                if (temp == null) { // Ima greshka negde
                    reactWith(msg, 'warning');
                } else {
                    await msg.channel.send(temp);
                }
                break;

            case 'flip':
                await msg.channel.send(
                    ["Heads", "Tails"][randomIntFromInterval(0, 1)]
                );
                break;

            case 'rps':
                await msg.channel.send(
                    [':rock:', ':newspaper:', ':scissors:'][randomIntFromInterval(0, 2)]
                );
                break;

            case 'shout':
                await msg.channel.send(
                    toDiscordChars(msg.content.substr(cmdLen))
                );
                break;

            case 'ch': 
                await channelRenamer(msg, cmd);
                break;

            case 'rn':
                temp = rnFunc(msg.content.substr(cmdLen));
                if (temp == null) {
                    reactWith(msg, 'warning');
                } else {
                    await msg.channel.send(temp);
                }
                break;

            case 'clear':
                // Nema dadeno broj, brojot ne e validen ili e pogolem od 15
                if (cmd.length == 1 || isNaN(cmd[1]) || (cmd[1] = parseInt(cmd[1])) > 15) {
                    reactWith(msg, 'warning');
                } else {
                    await msg.channel.bulkDelete(cmd[1], false);
                }
                break;

            case 'h':
                await msg.channel.send({
                    embeds: [helpEmbed]
                });
                break;

            case 'time':
                await msg.channel.send(localTime());
                break;

            case 'spotify':
                spotifyFunc(msg, cmd);
                break;

            case 'reminder':
                if (cmd[1] == 'list') {
                    // await msg.channel.send(ReminderData.listReminders());
                    ReminderData.listEmbed(msg);
                } else if (cmd[1] == 'remove') {
                    let keys = Object.keys(reminderList);
                    if (isNaN(cmd[2]) || keys.length < parseInt(cmd[2])) {
                        reactWith(msg, 'warning');
                    } else {
                        reminderList[keys[parseInt(cmd[2]) - 1]].stop();
                        reactWith(msg, 'success');
                    }
                } else {
                    reminderFunc(cmd, msg);
                }
                break;

            case 'imp':
                if (impData.timeout < date.getTime()) {
                    if (cmd.length > 1 && !isNaN(cmd[1])) {
                        impersonate(cmd[1], msg, client);
                    } else {
                        if (cmd[1] == 'r') {
                            impersonate(null, msg, client);
                        } else {
                            reactWith(msg, 'warning');
                        }
                    }
                } else {
                    reactWith(msg, 'timeout');
                }
                break;

            case 'status':
                StatusWrapper.setStatus(cmd, msg);
                break;

            case 'join': // music cmds
            case 'stop':
            case 'play':
            case 'pause':
            case 'skip':
            case 'test':
            case 'sp':
                musicParse(cmd, msg, client);
                break;

            case 'mot':
                fetchRandomQuote(msg);
                break;

            default:
                if (cmd[0] in emotes) {
                    await msg.channel.send(emotes[cmd[0]]);
                }
                break;
        }
    }
});

client.on('messageReactionAdd', async (msgReaction /*, user*/ ) => {
    if (msgReaction._emoji.name == '🤪') {
        const msgText = msgReaction.message.content;
        const mockText = [];
        let toggleUpper = false;
        for (let i = 0; i < msgText.length; i++) {
            const char = msgText.charAt(i);
            if (char == ' ') {
                mockText.push(char);
                continue;
            }
            mockText.push(
                toggleUpper ? char.toUpperCase() : char.toLowerCase()
            );
            toggleUpper = !toggleUpper;
        }
        msgReaction.message.channel.send(mockText.join(''));
    }
});

client.login(token);

// ###################################### Reminder ###################################### \\

function reminderFunc(cmd, msg) {
    let indexTime = {
        d: cmd[1].indexOf('d') != -1 ? cmd[1].indexOf('d') : false,
        h: cmd[1].indexOf('h') != -1 ? cmd[1].indexOf('h') : false,
        m: cmd[1].indexOf('m') != -1 ? cmd[1].indexOf('m') : false
    }

    // Dali ima vreme parametri (d, h, m)
    if (indexTime.d || indexTime.h || indexTime.m) {
        let d = 0;
        let h = 0;
        let m = 0;

        if (indexTime.d) { // 2d5h30m
            d = cmd[1].substr(0, indexTime.d); // den
            if (indexTime.h != false) {
                h = cmd[1].substr(indexTime.d + 1, indexTime.h - indexTime.d - 1); // saat
                if (indexTime.m != false) {
                    m = cmd[1].substr(indexTime.h + 1, indexTime.m - indexTime.h - 1); // minuta
                }
            } else if (indexTime.m != false) { // 2d30m
                m = cmd[1].substr(indexTime.d + 1, indexTime.m - indexTime.d - 1); // minuta
            }
        } else if (indexTime.h != false) { // 5h30m
            h = cmd[1].substr(0, indexTime.h); // saat
            if (indexTime.m != false) {
                m = cmd[1].substr(indexTime.h + 1, indexTime.m - indexTime.h - 1); // minuta
            }
        } else if (indexTime.m != false) { // 30m
            m = cmd[1].substr(0, indexTime.m); // minuta
        }

        // Proveri dali dobienite vrednosti se broevi, proveruva i dali se vo redosled
        // den, saat, minuti; bidejkji ako ne se, gore if blokot kje se poebe i dole
        // kje vrati poebani vrednosti :)
        if (isNaN(d) || isNaN(h) || isNaN(m)) {
            reactWith(msg, 'warning');
        } else {
            d = parseInt(d);
            h = parseInt(h);
            m = parseInt(m);

            // Proverka dali se pregolemi saatite i minutite
            if (h >= 23 || m >= 59) {
                reactWith(msg, 'warning');
            } else {
                // Top sme, stavi timer
                let time = (m * 60 + h * 3600 + d * 86400) * 1000;
                new ReminderData(time, msg.author.toString(), msg.content.substr(cmd[0].length + cmd[1].length + 3), msg.channel);
                reactWith(msg, 'success');
            }
        }
    } else {
        reactWith(msg, 'warning');
    }
}

// eslint-disable-next-line no-redeclare
var reminderList = {};
class ReminderData {
    constructor(time, user, message, channel) {
        this.time = time;
        this.user = user;
        this.message = message;
        this.channel = channel;
        this.id = new Date().getTime();
        reminderList[this.id] = this;
        this.timeout = setTimeout(sendReminder.bind(null, this), this.time);
    }

    stop() {
        clearTimeout(this.timeout);
        delete reminderList[this.id];
    }

    getInfo() {
        return `[${this.time}] ${this.user} - ${this.message}`;
    }

    getMessage() {
        return `${this.user} ${this.message}`;
    }

    static listEmbed(where) {
        if (Object.keys(reminderList).length == 0) {
            reactWith(where, 'error');
            return;
        }

        let stringBuilder = [];
        let n = 1;
        for (let i in reminderList) {
            stringBuilder.push(`${n}. ${reminderList[i].getMessage()}`);
            n += 1;
        }

        const exampleEmbed = {
            color: 0xf0bd26,
            author: {
                name: 'Active reminders'
            },
            description: stringBuilder.join('\n')
        };

        where.channel.send({
            embeds: [exampleEmbed]
        });
    }
}

function sendReminder(el) {
    el.channel.send(el.getMessage());
    el.stop();
}

// ###################################### Reminder ###################################### \\