'use strict';

const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const path = require('path');
const request = require('request');
const express = require('express');
const parseInfo = require('./parse-info');

const app = express();

module.exports = function (nodecg) {
	if (!nodecg.bundleConfig || !Object.keys(nodecg.bundleConfig).length > 0) {
		throw new Error('[qbit-rainwave-fetcher] Missing config file (cfg/qbit-rainwave-fetcher.json), aborting...');
	}

	const self = new EventEmitter();

	self.getInfo = () => {
		request.get('http://rainwave.cc/api4/info?sid=4', (err, response, body) => {
			if (!err && response.statusCode === 200) {
				const info = parseInfo(JSON.parse(body));
				info.coverArt = '/qbit-rainwave-fetcher/cache/' + info.coverArtFilename;
				if (nodecg.bundleConfig.enableCache) {
					const localPath = path.resolve(__dirname, nodecg.bundleConfig.cachePath, info.coverArtFilename);
					fs.stat(localPath, err => {
						if (err === null) {
							nodecg.log.info('Album found in local cache, skipping download...');
							self.emit('update', info);
						} else {
							nodecg.log.info('Album cover not found in local cache, downloading...');
							request.head(info.coverArtURL, err => {
								if (err) {
									nodecg.log.error('Something went wrong while trying to get Rainwave song information.');
									nodecg.log.error('Response status code: ' + response.statusCode);
									nodecg.log.error('Error: ' + err);
									self.emit('error', err);
								} else {
									request(info.coverArtURL).pipe(fs.createWriteStream(localPath)).on('close', () => {
										self.emit('update', info);
									});
								}
							});
						}
					});
				}

				setTimeout(function () {
					self.getInfo();
				}, info.expiresIn);
			} else {
				nodecg.log.error('Something went wrong while trying to get Rainwave song information, retrying in 10 seconds...');
				nodecg.log.error('Response status code: ' + response.statusCode);
				nodecg.log.error('Error: ' + err);
				self.emit('error', err);

				setTimeout(function () {
					self.getInfo();
				}, 10000);
			}
		});
	};

	self.getInfo();

	if (nodecg.bundleConfig.enableCache) {
		app.use('/qbit-rainwave-fetcher/cache/', express.static(path.join(__dirname, nodecg.bundleConfig.cachePath)));
		nodecg.mount(app);
	}

	return self;
};
