const {
	reactWith
} = require('./essentials');

const {
	guildId,
	botId,
	token
} = require('../config.json')

const axios = require('axios');

var impData = {
	avatarURL: 'https://i.imgur.com/HxIN0lA.jpg',
	timeout: 0,
	add10minCooldown: function () {
		let t = new Date();
		t.setMinutes(t.getMinutes() + 10);
		this.timeout = t.getTime();
	}
}

function impersonate(userId, msg, client) {
	const mainGuild = client.guilds.cache.get(guildId); // Nashiot server
	const changeAppearance = function (avatarURL, name, msg) { // Se povrata ovoj del, da ne go kopiram
		client.user.setAvatar(avatarURL)
			.then(() => {
				mainGuild.members.fetch(botId)
					.then(bot => {
						bot.setNickname(name);
						impData.add10minCooldown();
						reactWith(msg, 'success');
					})
					.catch(() => reactWith(msg, 'error'));
			})
			.catch(() => reactWith(msg, 'error'));
	}

	if (userId == null) {
		client.user.setAvatar(impData.avatarURL)
			.then(() => {
				mainGuild.members.fetch(botId)
					.then(bot => bot.setNickname(null))
					.catch(() => reactWith(msg, 'error'));
			})
			.catch(() => reactWith(msg, 'error'));

	} else {
		mainGuild.members.fetch(userId)
			.then(foundUser => {
				let name = foundUser.nickname != null ? foundUser.nickname : foundUser.user.username;
				changeAppearance(foundUser.user.avatarURL(), name, msg);
			})
			.catch(function () { // Ne e najden vo toj server
				axios({
						url: 'https://discord.com/api/v9/users/' + userId,
						method: 'get',
						headers: {
							'Authorization': 'Bot ' + token
						}
					})
					.then(function (response) { // Vrati data od najden korisnik
						let name = response.data.username;
						let avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${response.data.avatar}.png`;
						changeAppearance(avatarUrl, name, msg);
					})
					.catch(function () { // Ne e najden ili ne postoi toa id
						reactWith(msg, 'error');
					});
			});
	}
}

module.exports = {
	impData,
	impersonate
}