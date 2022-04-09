const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	demuxProbe,
	AudioPlayerStatus,
	NoSubscriberBehavior
} = require('@discordjs/voice');

const {
	reactWith
} = require('./essentials');

const ytdl = require('ytdl-core');
const StatusWrapper = require('./statusFunc');
const gTTS = require('gtts');

const musicData = {
	queue: [],
	currentlyPlaying: null,
	client: null,
	connection: null,
	player: null,
	paused: false,
	reset: function () { // Full reset
		this.paused = false;
		this.queue = [];
		this.connection = null
		this.player = null;
		this.paused = false;
	}
}

async function musicJoin(msg) {
	const channel = msg.member.voice.channel;
	if (channel == null || musicData.connection != null) {
		reactWith(msg, 'warning');
	} else {
		musicData.reset();
		musicData.connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: msg.guild.id,
			adapterCreator: msg.guild.voiceAdapterCreator
		});

		// Dodadi events kako da se odnesuva botot
		const player = createAudioPlayer({
			behaviors: {
				maxMissedFrames: 10000
			}
		});

		player.on(AudioPlayerStatus.Idle, async () => { // Zavrshil, pushti sledna pesna ako ima
			// console.log(' == Song stopped playing.')
			musicData.paused = false;
			if (musicData.queue.length == 0) { // Nema pesni vo queue
				musicData.currentlyPlaying = null;
				StatusWrapper.returnPrevious();
			} else { // Izvadi pesna od napred i pushti ja

				const videoLink = musicData.queue.shift();
				const {
					resource,
					videoName
				} = await getVideoNameAndCreateResource(videoLink);

				musicData.currentlyPlaying = resource;
				musicData.player.play(musicData.currentlyPlaying);
				StatusWrapper.setStatus(videoName, 'online.listen');
			}
		});

		player.on('error', (error) => {
			console.error('otide u kurac', error);
			musicLeave(null);
		});

		musicData.player = player;
	}
}

function musicLeave(msg) {
	if (musicData.connection != null) {
		musicData.connection.destroy();
		musicData.reset();
		StatusWrapper.returnPrevious();
	} else {
		reactWith(msg, 'warning');
	}
}

async function probeAndCreateResource(readableStream) {
	const {
		stream,
		type
	} = await demuxProbe(readableStream);
	return createAudioResource(stream, {
		inputType: type
	});
}

async function getVideoNameAndCreateResource(videoLink) {
	const videoData = await ytdl.getBasicInfo(videoLink);
	const stream = ytdl(videoLink, {
		filter: 'audioonly',
		quality: 'lowestaudio',
		dlChunkSize: 1048576,
		highWaterMark: 1 << 25
	});

	const videoName = videoData.videoDetails.title;
	const resource = await probeAndCreateResource(stream);

	return {
		resource,
		videoName
	}
}

async function speakFunc(text) {
	// TODO: Napravi da mozhe da zbori ako ima pushtena muzika
	if (musicData.currentlyPlaying == null) {
		const gtts = new gTTS(text, 'ru');
		const resource = await probeAndCreateResource(gtts.stream());
		musicData.player.play(resource);
		musicData.connection.subscribe(musicData.player);
	}
}

async function musicPlay(cmd, msg) {
	const videoLink = cmd[1];
	if (ytdl.validateURL(videoLink)) {
		if (musicData.currentlyPlaying == null) { // Nema pushteno pesna, pushti ja
			const {
				resource,
				videoName
			} = await getVideoNameAndCreateResource(videoLink);
			musicData.currentlyPlaying = resource;
			musicData.player.play(musicData.currentlyPlaying);
			musicData.connection.subscribe(musicData.player);
			StatusWrapper.setStatus(videoName, 'online.listen');
		} else { // Pushtena e muzika, dodaj ja vo queue
			musicData.queue.push(videoLink);
			reactWith(msg, 'approve');
		}
	} else {
		reactWith(msg, 'error');
	}
}

function musicPause(msg) {
	if (musicData.currentlyPlaying != null) {
		musicData.paused = !musicData.paused;
		if (musicData.paused) {
			musicData.player.pause();
		} else {
			musicData.player.unpause();
		}
	} else {
		reactWith(msg, 'warning');
	}
}

function musicSkip(msg) {
	// Ja stopira pesnata koja e pushtena i prodolzhuva normalno
	// kako da zavrshila sama pesnata
	if (musicData.currentlyPlaying != null) {
		musicData.player.stop();
	} else {
		reactWith(msg, 'warning');
	}
}

function musicParse(cmd, msg, client) {
	if (musicData.client == null) {
		musicData.client = client;
	}

	switch (cmd[0]) {
		case 'join':
			musicJoin(msg);
			break;

		case 'stop':
			musicLeave(msg);
			break;

		case 'play':
			musicPlay(cmd, msg);
			break;

		case 'pause':
			musicPause(msg);
			break;

		case 'skip':
			musicSkip(msg);
			break;

		case 'sp':
			speakFunc(cmd.slice(1).join(' '));
			break;

		default:
			break;
	}
}

module.exports = musicParse;