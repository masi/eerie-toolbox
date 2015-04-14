var fs = require('fs');
var FileWalker = require('../lib/filewalker.js');

var indent = '';
var f = new FileWalker();
f.process('.',
	function (filename, relativePath, absolutePath) {
		console.log(indent + filename);
		console.log(indent + '* ' + relativePath);
		console.log(indent + '* ' + absolutePath);
		console.log('');
	},
	function (filename, relativePath, absolutePath) {
		console.log('-->');
		console.log('');
	},
	function (filename, relativePath, absolutePath) {
		console.log('<--');
		console.log('');
	}
);

phantom.exit();
