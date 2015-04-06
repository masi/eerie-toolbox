/**
 *
 */

'use strict';

/**
 *
 * @param pageWalker
 * @constructor
 */
function ImageScraper(pageWalker, imageDirectory) {
	this.pageWalker = pageWalker;
	this.setImageDirectory(imageDirectory);
}

/**
 *
 * @param pageWalker
 */
ImageScraper.prototype.setPageWalker = function (pageWalker) {
	this.pageWalker = pageWalker;
}

ImageScraper.prototype.setImageDirectory = function(imageDirectory) {
	this.imageDirectory = (imageDirectory || '.').replace(/\/?$/, '/');
}

/**
 *
 * @param array queue
 * @param function onDone
 */
ImageScraper.prototype.processQueue = function (queue, onDone) {
	var self = this,
		prefix;
	this.pageWalker.processQueue(
		queue,
		function (item, context) {
			var i;
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
		undefined,
		function () {
			if (onDone) {
				onDone();
			}
		}
	);
}

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
}

module.exports = ImageScraper;
