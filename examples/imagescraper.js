
var webpage = require('../webpage.js').create();
var PageWalker = require('../lib/pagewalker.js');
var ImageScraper = require('../lib/imagescraper.js');

phantomJsOrg = new ImageScraper(new PageWalker(webpage));
console.log('SCRAPING...');
phantomJsOrg.processQueue(
	[
		{ url: 'http://phantomjs.org/', selectors: '.intro-example' },
		{ url: 'http://phantomjs.org/quick-start.html', selectors: '.highlight' },
		{ url: 'http://phantomjs.org/faq.html', selectors: '.link-release' }
	],
	function () {
		console.log('DONE');
		phantom.exit()
	}
)