/**
 *
 */

'use strict';

/**
 *
 * @param {PageWalker} pageWalker
 * @param {string} [imageDirectory]
 * @class
 */
function ImageScraper(pageWalker, imageDirectory) {
	/** @member {PageWalker} pageWalker */
	/** @member {string} imageDirectory */

	this.setPageWalker(pageWalker);
	this.setImageDirectory(imageDirectory);
}

/**
 *
 * @param {object} [webpage]
 * @returns {ImageScraper}
 */
ImageScraper.build = function (webpage) {
	webpage = webpage || require('../webpage.js').create();
	var PageWalker = require('./pagewalker.js');

	return new ImageScraper(new PageWalker(webpage));
};

/**
 *
 * @param {PageWalker} pageWalker
 * @returns {ImageScraper}
 */
ImageScraper.prototype.setPageWalker = function (pageWalker) {
	this.pageWalker = pageWalker;
	return this;
};

/**
 *
 * @param {string} imageDirectory
 * @returns {ImageScraper}
 */
ImageScraper.prototype.setImageDirectory = function (imageDirectory) {
	this.imageDirectory = (imageDirectory || '.').replace(/\/?$/, '/');
	return this;
};

/**
 *
 * @param {object[]} queue
 * @param {function} onDone
 */
ImageScraper.prototype.processQueue = function (queue, onDone, onLoadError, onError) {
	var self = this,
		prefix;
	this.pageWalker.processQueue(
		queue,
		function (item, context) {
			var i;
			context.client.evaluate(function() {
				if (window.getComputedStyle(document.body).backgroundColor === 'rgba(0, 0, 0, 0)') {
					document.body.style.backgroundColor = '#fff';
				}
			});
			// @todo handle file:///
			prefix = context.url.replace(/https?:\/\//g, '').replace(/[/\\:;*?!&()<>#|"`^]/g, '-');
			if (item.selectors.length > 0) {
				for (i = 0; i < item.selectors.length; i++) {
					self._createImage(context.client, item.selectors[i], prefix);
				}
			} else {
				self._createImage(context.client, '', prefix);
			}
		},
		function (context) {
			if (onDone) {
				onDone(context);
			}
		},
		function (item, error, context) {
			if (onLoadError) {
				onLoadError(item, error, context);
			}
		},
		function (item, error, context) {
			if (onError) {
				onError(item, error, context);
			}
		}
	);
};

/**
 *
 * @param webpage
 * @param selector
 * @param prefix
 * @protected
 */
ImageScraper.prototype._createImage = function (webpage, selector, prefix) {
	var clipRect = webpage.clipRect;
	if (selector) {
		webpage.clipRect = webpage.evaluate(function (selector) {
			return document.querySelector(selector).getBoundingClientRect();
		}, selector);
	}
	// @todo use meaningful name (build in calling function)
	webpage.render(this.imageDirectory + prefix + '-' + selector + '.png');
	webpage.clipRect = clipRect;
};

module.exports = ImageScraper;
