var fs = require('fs');
var webpage = require('../webpage.js').create();
var PageWalker = require('../lib/pagewalker.js');
var ImageScraper = require('../lib/imagescraper.js');

fs.makeDirectory('imagescraper-images');

phantomJsOrg = new ImageScraper(new PageWalker(webpage), 'imagescraper-images');
console.log('SCRAPING...');
phantomJsOrg.processQueue(
	[
		{ url: 'http://phantomjs.org/', selectors: ['.header img', '.intro-example'] },
		{ url: 'http://phantomjs.org/quick-start.html', selectors: ['.highlight'] },
		{ url: 'http://phantomjs.org/faq.html', selectors: ['.link-release'] },
		{ url: 'http://phantomjs.org/examples/', selectors: [] }
	],
	function (context) {
		console.log('DONE');
		phantom.exit();
	},
	function (item, error, context) {
		console.log('LOAD ERROR: ' + item.url);
	},
	function (item, error, context) {
		console.log('ERROR: ' + error.message);
		phantom.exit(1);
	}
);
