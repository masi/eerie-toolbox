/**
 *
 */

'use strict';

/**
 *
 * @param pageWalker
 * @constructor
 */
function ImageScraper(pageWalker) {
	this.pageWalker = pageWalker;
}

/**
 *
 * @param pageWalker
 */
ImageScraper.prototype.setPageWalker = function(pageWalker) {
	this.pageWalker = pageWalker;
}

/**
 *
 * @param array queue
 * @param function onDone
 */
ImageScraper.prototype.processQueue = function(queue, onDone) {
	var self = this,
		prefix;
	this.pageWalker.processQueue(
		queue,
		function (item, context) {
			// @todo handle file:///
			prefix = context.url.replace(/https?:\/\//g, '').replace(/[/\\:;*?!&()<>#|"`^]/g, '-');
			// @todo allow more than one selector
			self._createImage(context.client, item.selectors, prefix);
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
	// @todo use meaningful name
	webpage.render(prefix + '-' + selector + '.png');
	webpage.clipRect = clipRect;
}

module.exports = ImageScraper;
