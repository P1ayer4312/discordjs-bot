const {
    toDiscordChars,
    randomIntFromInterval
} = require('./essentials');

const {
    MessageEmbed
} = require('discord.js');

function rollFunc(cmd) {
    if (cmd.length == 1)
        return toDiscordChars(randomIntFromInterval(0, 100));

    if (isNaN(cmd[1]))
        return null;

    cmd[1] = parseInt(cmd[1]);
    if (cmd.length == 2)
        return toDiscordChars(randomIntFromInterval(0, cmd[1]));

    if (isNaN(cmd[2]) || (cmd[2] = parseInt(cmd[2])) < cmd[1])
        return null;

    return toDiscordChars(randomIntFromInterval(cmd[1], cmd[2]));
}

function rnFunc(args) {
    let reply;
    let options = args.substr(args.indexOf('?') + 1).split('.');
    const colors = [
        "#ff0000",
        "#fc4444",
        "#fc6404",
        "#fcd444",
        "#8cc43c",
        "#029658",
        "#1abc9c",
        "#5bc0de",
        "#6454ac",
        "#fc8c84"
    ];
    // Proveri dali e prashanje
    if (args.indexOf('?') != -1) {
        if (args.indexOf('.') != -1) {
            reply = new MessageEmbed()
                .setTitle(options[randomIntFromInterval(0, options.length - 1)].trim())
                .setAuthor(args.substr(0, args.indexOf('?') + 1))
                .setURL('https://sho.klikash/?ae=idi_nazad')
                .setColor(colors[randomIntFromInterval(0, 9)]);

        } else {
            reply = new MessageEmbed()
                .setTitle(["Yes", "No"][randomIntFromInterval(0, 1)])
                .setAuthor(args.substr(0, args.indexOf('?') + 1))
                .setURL('https://sho.klikash/?ae=idi_nazad')
                .setColor(colors[randomIntFromInterval(0, 9)]);

        }
    } else if (args.indexOf('.') == -1) { // Nema nitu prashanje nitu izbor
        return null;
    } else { // Vrati random izbor
        reply = new MessageEmbed()
            .setTitle(options[randomIntFromInterval(0, options.length - 1)].trim())
            .setColor(colors[randomIntFromInterval(0, 9)]);
    }

    return {
        embeds: [reply]
    };
}

module.exports = {
    rnFunc,
    rollFunc
}