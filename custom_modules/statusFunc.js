const {
	reactWith
} = require('./essentials');

let client = null; // Go chuvame za da ne go prakjame so sekoj povik na funkcija
const statusData = {
	default: {
		status: 'online',
		message: '!h - HELP!!!'
	},
	setStatus: undefined,
	setMessage: undefined
}

function statusFunc(where, cmd) {
	if (client == null) { // Nema referenca do client
		throw new Error('Client is not initialized.');
	}
	const doTheThing = function (args, statusText) { // Se povrata ovoj del
		const activityType = {
			'play': 'PLAYING',
			'listen': 'LISTENING',
			'watch': 'WATCHING',
			'comp': 'COMPETING'
		}
		if (cmd != null && cmd[0] != null) {
			statusData.setMessage = statusText;
			statusData.setStatus = cmd[1];
		}
		if (args[0] == 'stream') {
			// Ako e invis i stavi stream ne se gleda, mora da ima nekoj status
			client.user.setStatus('online');
			client.user.setActivity(statusText, {
				type: 'STREAMING',
				url: 'https://www.twitch.tv/thegreenhunter7'
			});
		} else {
			client.user.setStatus(args[0]);
			if (args.length == 2 && args[1] in activityType) {
				client.user.setActivity(statusText, {
					type: activityType[args[1]]
				});
			} else {
				client.user.setActivity(statusText); // Kje ima ista vrednost ko statusData.setMessage
			}
		}
	}

	if (cmd == null) { // Vrati gi setStatus i setMessage
		doTheThing(
			statusData.setStatus.split('.'),
			statusData.setMessage
		)
	} else if (cmd.length == 1) {
		reactWith(where, 'warning');
	} else {
		if (cmd[1] == 'r') {
			client.user.setStatus(statusData.default.status);
			client.user.setActivity(statusData.default.message);
			statusData.setMessage = statusData.default.message;
			statusData.setStatus = statusData.default.status;
		} else {
			const args = cmd[1].split('.');
			if (args[0] == 'invis') {
				// Samo go pravi nevidliv, nema potreba da gi pravi rabotite dole
				client.user.setStatus('invisible');
				return;
			}
			const presenceStatusData = {
				'online': 'online',
				'idle': 'idle',
				'dnd': 'dnd',
				'stream': 0 // stream e activitytype
			}
			let statusText;
			if (cmd[0] == null) { // Ova go koristime ako vlecheme od DiscordDb
				statusText = cmd[2];
			} else { // Ova go koristime ako ja koristime !status komandata
				statusText = cmd[2] != undefined ? where.content.substr(cmd[0].length + cmd[1].length + 2) : statusData.setMessage;
				statusData.setMessage = statusText;
			}

			if (args[0] in presenceStatusData) {
				doTheThing(args, statusText)
			} else {
				doTheThing(
					statusData.setStatus.split('.'),
					cmd.slice(1).join(' ') // Trgni go !status i zemi go ostatokot od porakata
				);
			}
		}
	}
}

class StatusWrapper {
	static init(cl) {
		client = cl;
		return this;
	}
	/**
	 * Return default status message
	 */
	static resetDefault() {
		statusFunc(null, [null, 'r']);
	}
	/**
	 * Either send message object and parsed cmd array, or send message and active status
	 * @param {*} param1 string or cmd array
	 * @param {('online'|'online.play'|'online.listen'|'online.watch'|'online.comp'|'idle'|'idle.play'|'idle.listen'|'idle.watch'|'idle.comp'|'dnd'|'dnd.play'|'dnd.listen'|'dnd.watch'|'dnd.comp'|'stream')} param2 bot status or message object
	 */
	static setStatus(param1, param2='online') {
		if (typeof(param1) == 'object') {
			statusFunc(param2, param1);
		} else {
			statusFunc(null, [null, param2, param1]);
		}
	}
	static returnPrevious() {
		statusFunc(null, null);
	}
}

module.exports = StatusWrapper;