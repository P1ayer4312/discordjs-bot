const {
	randomIntFromInterval,
	reactWith
} = require('./essentials');

const {
	BASE64_CLIENTID_SECRET
} = require('../config.json')

const axios = require('axios');
const {
	MessageEmbed
} = require('discord.js');

var spotifyData = {
	SPOTIFY_TOKEN: "",
	timeTaken: -1,
	dayTaken: -1,
	CATEGORIES: [
		'toplists', 'hiphop', 'pop',
		'mood', 'edm_dance', 'rock',
		'chill', 'equal', 'radar',
		'fresh_finds', 'party', 'in_the_car',
		'sleep', 'workout', 'indie_alt',
		'alternative', 'decades', 'metal',
		'at_home', 'kids_family', 'holidays',
		'rnb', 'reggae', 'focus',
		'frequency', 'happier_than_ever', 'pride',
		'romance', 'classical', 'dinner',
		'country', 'wellness', 'kpop',
		'jazz', 'soul', 'punk',
		'caribbean', 'latin', 'gaming',
		'travel', 'instrumental', 'ambient',
		'thirdparty', 'music_and_talk', 'arab',
		'popculture', 'funk', 'roots',
		'blues', 'word'
	],
	lastCategory: null
}

function spotifyFunc(msg, cmd) {
	if (cmd[1] == undefined || spotifyData.CATEGORIES.includes(cmd[1])) { // Samo !spotify e napishano ili e vnesena kategorija
		const date = new Date();
		spotifyData.lastCategory = cmd[1] == undefined ? spotifyData.CATEGORIES[randomIntFromInterval(0, spotifyData.CATEGORIES.length - 1)] : cmd[1];

		if (date.getTime() !== spotifyData.timeTaken || date.getDate() !== spotifyData.dayTaken) {
			refreshSpotifyData(msg);
		} else {
			getSpotifyPlaylist(msg, spotifyData.lastCategory);
		}
	} else if (cmd[1] == 'list') { // Vrati embed so kategorii
		const categories = new MessageEmbed()
			.setColor('#81b71a')
			.setTitle('Avaliable categories:')
			.setDescription(spotifyData.CATEGORIES.join(', '));

		msg.channel.send({
			embeds: [categories]
		});
	} else {
		reactWith(msg, 'warning');
	}
}

function refreshSpotifyData(msg) {
	axios({
		url: 'https://accounts.spotify.com/api/token',
		method: 'post',
		params: {
			grant_type: 'client_credentials'
		},
		headers: {
			'Authorization': 'Basic ' + BASE64_CLIENTID_SECRET
		}
	}).then(function (res1) { // Get access token
		const date = new Date();
		spotifyData.SPOTIFY_TOKEN = res1.data.access_token;
		spotifyData.timeTaken = date.getTime();
		spotifyData.dayTaken = date.getDay();

		getSpotifyPlaylist(msg, spotifyData.lastCategory);

		//? Kodot za vlechenje kategorii
		// axios({
		// 	url: 'https://api.spotify.com/v1/browse/categories',
		// 	method: 'get',
		// 	headers: {
		// 		'Authorization': 'Bearer ' + spotifyData.SPOTIFY_TOKEN
		// 	}
		// }).then(function (res2) { // Get categories
		// 	spotifyData.CATEGORIES = [];
		// 	res2.data.categories.items.map(e => {
		// 		spotifyData.CATEGORIES.push({
		// 			'id': e.id
		// 		});
		// 		// 'name': e.name,
		// 		// 'icon': e.icons[0].url
		// 	});
		// 	setTimeout(function () {
		// 		getSpotifyPlaylist(msg, spotifyData.CATEGORIES[randomIntFromInterval(0, spotifyData.CATEGORIES.length - 1)]);
		// 	}, 1500);
		// }).catch(function (error) {
		// 	console.log(error)
		// })
	}).catch(function (error) {
		console.log(error)
	})
}

function getSpotifyPlaylist(msg, category) {
	axios({
		url: `https://api.spotify.com/v1/browse/categories/${category}/playlists`,
		method: 'get',
		headers: {
			'Authorization': 'Bearer ' + spotifyData.SPOTIFY_TOKEN
		}
	}).then(function (res) { // Get playlists from chosen category
		let playlists = res.data.playlists.items;
		let choose = playlists[randomIntFromInterval(0, playlists.length - 1)];

		// .setThumbnail(category.icon)
		// .setImage(choose.images[0].url);

		// const exampleEmbed = new MessageEmbed()
		//     .setColor('#1ed75f')
		//     .setTitle(choose.name)
		//     .setURL(choose.external_urls.spotify)
		//     .setAuthor('Spotify',
		//         'https://raw.githubusercontent.com/P1ayer4312/discord-bot-assets/main/imgs/spotify_icon.png',
		//         'https://discord.js.org')
		//     .setDescription(choose.description)
		//     .setThumbnail(category.icon)
		//     .addFields({
		//         name: 'Category:',
		//         value: category.name
		//     })
		//     .setImage(choose.images[0].url);

		msg.channel.send(choose.external_urls.spotify);

	}).catch(function (error) {
		console.log(error)
	})
}

module.exports = spotifyFunc;