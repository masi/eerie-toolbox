/**
 *
 */

'use strict';

/**
 *
 * @param {object} client object compatible with PhantomJS webpage object
 * @class
 */
function PageWalker(client) {
	if (typeof client !== 'object') {
		throw new TypeError('Argument "client" is not an object.');
	}
	this.client = client;
	this.i = undefined;
}

/**
 *
 * @param {object[]} queue
 * @param {function} onLoad
 * @param {function} onLoadError
 * @param {function} onDone
 * @param {function} onError
 */
PageWalker.prototype.processQueue = function(queue, onLoad, onLoadError, onDone, onError) {
	if (this.i !== undefined) {
		throw Error('A queue is currently being processed.');
	}
	if (typeof queue !== 'object' || typeof queue.length === 'undefined') {
		throw new TypeError('Argument "queue" is not an array.');
	} else if (!queue) {
		throw new TypeError('Argument "queue" is null.');
	}
	this.queue = Array.prototype.slice.call(queue);
	this.i = 0;
	this._processQueueItem(onLoad, onLoadError, onDone, onError);
};

/**
 *
 * @param {function} onLoad
 * @param {function} onLoadError
 * @param {function} onDone
 * @param {function} onError
 * @protected
 */
PageWalker.prototype._processQueueItem = function(onLoad, onLoadError, onDone, onError) {
	var self = this,
		context, url;
	if (this.i === undefined) {
		throw Error('Queue is in an undefined state.');
	}
	if (this.queue[this.i]) {
		if (typeof this.queue[this.i] === 'object') {
			url = this.queue[this.i].url;
		} else {
			url = this.queue[this.i];
		}
		context = {
			url: url,
			index: this.i,
			client: this.client
		};
		this.client.open(url)
			.then(function() {
				if (onLoad) {
					onLoad(self.queue[self.i], context);
				}
			}, function(error) {
				if (onLoadError) {
					onLoadError(self.queue[self.i], error, context);
				}
			})
			.then(function() {
				self.i++;
				self._processQueueItem(onLoad, onLoadError, onDone, onError);
			})
			.then(undefined, function(error) {
				if (onError) {
					onError(self.queue[self.i], error, context);
				}
			});
	} else {
		// @todo report number of success/failure and elapsed time
		context = {
			client: this.client
		};
		if (onDone) {
			onDone(context);
		}
		this.i = undefined;
	}
};

module.exports = PageWalker;
