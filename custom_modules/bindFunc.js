const {
	// eslint-disable-next-line no-unused-vars
	DiscordDb
} = require('./DiscordDb/DiscordDb');
const {
	reactWith
} = require('./essentials');

let bindList = null;
let bindRowName = null;

class BindWrapper {
	/**
	 * Fetch existing binds if they are any and store them locally.
	 * @param {DiscordDb} discordDb 
	 * @param {string} rowName
	 */
	static init(discordDb, rowName) {
		discordDb.findRowByName(rowName)
			.then(data => {
				bindList = data;
				bindRowName = rowName;
				console.log(bindList);
			});
	}

	/**
	 * Find if a bind exists and send it to the message's channel.
	 * @param {Object} msg 
	 * @param {string} bindName 
	 */
	static get(msg, bindName) {
		if (bindName in bindList) { // Proveri dali e bind
			msg.channel.send(bindList[bindName]);
		}
	}

	/**
	 * Function for managing bind commands using DiscordDb
	 * @param {Array} cmd 
	 * @param {DiscordDb} discordDb DiscordDb
	 * @param {Object} msg Message
	 */
	static parse(cmd, msg, discordDb) {
		switch (cmd[1]) { // bind add <name> <imgUrl>
			case 'add':
				if (cmd.length < 4) {
					reactWith(msg, 'warning');
				} else {
					const bindName = cmd[2];
					const bindContent = cmd.slice(3).join(' ');
					bindList[bindName] = bindContent;
					discordDb.setParamToRowByName(bindRowName, bindName, bindContent);
				}
				break;

			case 'remove': // bind remove <name>
				if (cmd.length < 3) {
					reactWith(msg, 'warning');
				} else {
					const bindName = cmd[2];
					delete bindList[bindName];
					discordDb.removeParamFromRowByName(bindRowName, bindName, msg);
				}
				break;

			case 'list':
				var keys = Object.keys(bindList);
				if (keys.length === 0) {
					reactWith(msg, 'error');
				} else {
					msg.channel.send(keys.join(', '));
				}
				break;

			default:
				break;
		}
	}
}
module.exports = BindWrapper;