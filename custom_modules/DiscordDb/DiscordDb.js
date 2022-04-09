const {
	channelDb,
	rowsIdsHolder,
	guildId
} = require('./config.json');

const EventEmitter = require('events');

const {
	reactWith
} = require('../essentials');

/**
 * Creates a DiscordDb instance for easily editing and fetching Discord messages' JSON data.
 * @class
 */
class DiscordDb extends EventEmitter {
	constructor(client) {
		super();
		this.dbChannel = client.guilds.cache.get(guildId).channels.cache.get(channelDb);
		this.rows = {};
		this.getJSON(rowsIdsHolder)
			.then(response => {
				this.rows = response;
				console.log('DiscordDb instance created:', this.rows);
				this.emit('ready');
			});
	}

	/**
	 * Function that parses arguments from received message.
	 * @param {Array} cmd 
	 * @param {Object} msg Message
	 */
	parse(cmd, msg) {
		if (cmd[1] == 'rows') { // db rows ...
			switch (cmd[2]) {
				case 'test':
					console.log(this.rows);
					break;

				case 'init': // db rows init
					this.addRow('RowsIdsHolder');
					break;

				case 'list': // db rows list
					// this.findRow(rowsIdsHolder)
					// 	.then(resp => msg.channel.send(resp.content));
					msg.channel.send(DiscordDb.toDiscordJsonString(this.rows));
					break;

				case 'create': // db rows create <rowName>
					if (cmd[3] == undefined || cmd[3] == '' || Object.keys(this.rows).includes(cmd[3])) {
						// Proveri dali e prateno ime na row i dali vekje postoi toa ime
						reactWith(msg, 'warning');
					} else {
						// Dodaj go noviot row vo listata lokalno i prati ja da se chuva vo rowsIdsHolder
						const rowName = cmd[3];
						this.addRow(rowName)
							.then(msgId => {
								this.rows[rowName] = msgId;
								this.setParamToRow(rowsIdsHolder, rowName, msgId);
							});
					}
					break;

				case 'remove': // db rows remove <rowName>
					if (cmd[3] == undefined || cmd[3] == '' || !Object.keys(this.rows).includes(cmd[3])) {
						// Proveri dali e prateno ime na row i dali ne postoi toa ime
						reactWith(msg, 'warning');
					} else {
						// Go brisheme kako parametar da ne postoi toj row vo rowsIdsHolder,
						// da ne te buni imeto zoshto brisheme param a e row
						const rowName = cmd[3];
						delete this.rows[rowName];
						this.removeParamFromRow(rowsIdsHolder, rowName, msg);
					}
					break;

				case 'get': // db rows get <rowName>
					if (cmd[3] == undefined || cmd[3] == '' || !Object.keys(this.rows).includes(cmd[3])) {
						// Proveri dali e prateno ime na row i dali ne postoi toa ime
						reactWith(msg, 'warning');
					} else {
						const rowNameId = this.rows[cmd[3]];
						this.findRow(rowNameId)
							.then(resp => msg.channel.send(resp.content));
					}
					break;

				case 'set': // db rows set <rowName> <rowId>
					if (cmd.length < 5) {
						// Proveri dali e prateno ime na row i dali ne postoi toa ime
						reactWith(msg, 'warning');
					} else {
						// Go brisheme kako parametar da ne postoi toj row vo rowsIdsHolder,
						// da ne te buni imeto zoshto brisheme param a e row
						const rowName = cmd[3];
						this.rows[rowName] = cmd[4]; // id na toj row
						this.setParamToRow(rowsIdsHolder, cmd[3], cmd[4]);
					}
					break;

				default:
					break;
			}
		} else if (cmd[1] == 'datarow') { //db datarow ...
			switch (cmd[2]) {
				case 'set': // db datarow set <rowName> <key> <value>
					if (cmd.length < 6 || !Object.keys(this.rows).includes(cmd[3])) {
						// Proveri dali se prateni site parametri i dali postoi toj row
						reactWith(msg, 'warning');
					} else {
						const rowNameId = this.rows[cmd[3]];
						this.setParamToRow(rowNameId, cmd[4], cmd.slice(5).join(' '));
					}
					break;

				case 'remove': // db datarow remove <rowName> <key>
					if (cmd.length < 5 || !Object.keys(this.rows).includes(cmd[3])) {
						// Proveri dali se prateni site parametri i dali postoi toj row
						reactWith(msg, 'warning');
					} else {
						const rowNameId = this.rows[cmd[3]];
						this.removeParamFromRow(rowNameId, cmd[4], msg);
					}
					break;

				default:
					break;
			}
		}
	}

	/**
	 * Removes a parameter from a row if it exists. If an error occurs, 
	 * it sends a warning to the Message's channel provided.
	 * @param {string} rowId 
	 * @param {string} key 
	 * @param {Object} msg Message
	 */
	removeParamFromRow(rowId, key, msg) {
		this.findRow(rowId)
			.then(res => {
				let obj = DiscordDb.parseDiscordJsonFormatter(res.content);
				if (key in obj) { // Proveri dali taa promenliva postoi
					delete obj[key];
					res.edit(DiscordDb.toDiscordJsonString(obj)).catch(console.log);
				} else {
					reactWith(msg, 'warning');
				}
			})
			.catch(console.error);
	}

	/**
	 * Sets a parameter with a key and value to an existing row.
	 * @param {string} rowId 
	 * @param {string} key 
	 * @param {*} value 
	 */
	setParamToRow(rowId, key, value) {
		this.findRow(rowId)
			.then(res => {
				let obj = DiscordDb.parseDiscordJsonFormatter(res.content);
				obj[key] = value;
				res.edit(DiscordDb.toDiscordJsonString(obj));
			})
			.catch(console.error);
	}

	/**
	 * Sends two messages inside the provided db channel: one for the row name and
	 * one that will hold the JSON data.
	 * @param {string} rowName 
	 * @returns {Promise}
	 */
	addRow(rowName) {
		return new Promise((resolve, reject) => {
			this.dbChannel.send(`**${rowName}**`)
				.then(() => {
					this.dbChannel.send(DiscordDb.toDiscordJsonString({}))
						.then(msg => resolve(msg.id))
						.catch(reject);
				})
				.catch(reject);
		});
	}

	/**
	 * Fetch a message object from the defined Discord db channel by providing a Message id.
	 * @param {string} rowId Snowflake
	 * @returns {Promise}
	 */
	findRow(rowId) {
		return new Promise((resolve, reject) => {
			this.dbChannel
				.messages.fetch(rowId)
				.then(res => resolve(res))
				.catch(() => reject('Error: Can\'t get row.'));
		});
	}

	/**
	 * Returns parsed JSON object fetched from the Message id.
	 * @param {string} row 
	 * @returns 
	 */
	getJSON(row) {
		return new Promise((resolve, reject) => {
			this.findRow(row)
				.then(res => resolve(DiscordDb.parseDiscordJsonFormatter(res.content)))
				.catch(() => reject('Error: Can\'t fetch JSON string.'));
		});
	}

	/**
	 * Returns a JSON object from an existing row name.
	 * @param {string} rowName 
	 * @returns {Promise} JSON Object
	 */
	findRowByName(rowName) {
		return new Promise((resolve, reject) => {
			if (rowName in this.rows) {
				const rowNameId = this.rows[rowName];
				resolve(this.getJSON(rowNameId));
			} else {
				reject("ERROR: Row can't be accessed or it doesn't exist.");
			}
		});
	}

	/**
	 * Sets a parameter with a key and value to an existing row with provided row name.
	 * @param {string} rowName 
	 * @param {string} key 
	 * @param {string} value 
	 */
	setParamToRowByName(rowName, key, value) {
		if (rowName in this.rows) {
			const rowNameId = this.rows[rowName];
			this.setParamToRow(rowNameId, key, value);
		} else {
			throw new Error(`DiscordDb: "${rowName}" doesn't exist.`);
		}
	}

	/**
	 * Removes a parameter from a row with provided row name. If an error occurs, 
	 * it sends a warning to the Message's channel provided.
	 * @param {string} rowName 
	 * @param {string} key 
	 * @param {Object} msg Message 
	 */
	removeParamFromRowByName(rowName, key, msg) {
		if (rowName in this.rows) {
			const rowNameId = this.rows[rowName];
			this.removeParamFromRow(rowNameId, key, msg);
		} else {
			throw new Error(`DiscordDb: "${rowName}" doesn't exist.`);
		}
	}

	/**
	 * Stringifies an object to a JSON formatted Discord message.
	 * @param {Object} object 
	 * @returns 
	 */
	static toDiscordJsonString(object) {
		return "```json\n" + JSON.stringify(object) + "```";
	}

	/**
	 * Static function that parses data from a JSON formatted Discord message.
	 * @param {string} JSONstring 
	 * @returns 
	 */
	static parseDiscordJsonFormatter(JSONstring) {
		return JSON.parse(JSONstring.replace("```json\n", '').replace("```", ''));
	}
}

module.exports = DiscordDb;