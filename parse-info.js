'use strict';

module.exports = function (rawData) {
	const songData = {};

	songData.title = rawData.sched_current.songs[0].title;

	songData.artist = '';
	rawData.sched_current.songs[0].artists.forEach(function (i) {
		songData.artist += i.name + ', ';
	});
	songData.artist = songData.artist.substr(0, songData.artist.lastIndexOf(','));

	songData.album = rawData.sched_current.songs[0].albums[0].name;

	songData.coverArtFilename = rawData.sched_current.songs[0].albums[0].art.split('/').pop() + '_240.jpg';
	songData.coverArtURL = 'http://rainwave.cc' + rawData.sched_current.songs[0].albums[0].art + '_240.jpg';
	songData.expiresIn = (rawData.sched_current.end - rawData.api_info.time) * 1000;

	return songData;
};
