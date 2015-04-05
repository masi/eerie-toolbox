/**
 *
 */

'use strict';

if (typeof Promise !== 'function') {
	global.Promise = require('../compatibility/Promise.js');
}

function open(url, callback) {
	var self = this;
	if (typeof url !== 'string') {
		throw TypeError('Argument "url" must be a string.');
	}
	if (callback && typeof url !== 'function') {
		throw TypeError('Argument "callback" must be a function.');
	}
	return new Promise(function(resolve, reject) {
		self._originalOpen(url, function(status) {
			if (callback) {
				callback(status);
			}
			if (status === 'success') {
				resolve();
			} else {
				reject();
			}
		});
	});
}

function extendWebpage(webpage) {
	webpage._originalMethods = {
		open: webpage.open
	}
	webpage._originalOpen = webpage.open;
	webpage.open = open;
}

module.exports = {
	create: function() {
		var webpage = require('webpage').create();
		extendWebpage(webpage);
		return webpage;
	}
}
