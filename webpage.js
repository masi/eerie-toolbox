/**
 *
 */

var factory;

if (typeof slimer === 'object') {
	factory = require('webpage');
} else if (typeof phantom === 'object') {
	factory = require('./webpage/phantomjs.js');
}

module.exports = {
	create: function() {
		return factory.create();
	}
}
