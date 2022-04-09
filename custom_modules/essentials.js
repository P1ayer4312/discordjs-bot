function toDiscordChars(word) {
    word = word.toString().toLowerCase();
    const dict = {
        '1': ":one:",
        '2': ":two:",
        '3': ":three:",
        '4': ":four:",
        '5': ":five:",
        '6': ":six:",
        '7': ":seven:",
        '8': ":eight:",
        '9': ":nine:",
        '0': ":zero:",
        '-': ":no_entry:",
        ' ': " "
    }

    let stringBuilder = [];
    for (let i = 0; i < word.length; i++) {
        let charAt = word.charAt(i);
        if (charAt != '-' && charAt != ' ' && isNaN(charAt)) {
            stringBuilder.push(`:regional_indicator_${charAt}:`);
        } else {
            stringBuilder.push(dict[charAt]);
        }
    }

    return stringBuilder.join('');
}

/**
 * Reacts to a messaage based on sent reaction name
 * @param {Object} where Message
 * @param {('warning'|'success'|'error'|'timeout'|'approve')} reaction 
 */
function reactWith(where, reaction) {
    switch (reaction) {
        case 'warning':
            where.react('⚠️');
            break;
        case 'success':
            where.react('✅');
            break;
        case 'error':
            where.react('❌');
            break;
        case 'timeout':
            where.react('⌛');
            break;
        case 'approve':
            where.react('☑️')
            break;
        default:
            break;
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function localTime() {
	const date = new Date();
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	return `${date.toLocaleString("mk-MK", options)} ${date.toLocaleString("mk-MK", {timeStyle: "long"})}`;
}

module.exports = {
	toDiscordChars,
	randomIntFromInterval,
	reactWith,
	localTime
}