/**
 *
 */

'use strict';

var fs = require('fs');
var system = require('system');

/**
 *
 * @class
 */
function FileWalker() {
}

/**
 *
 * @param {string} directoryPath
 * @param {function} onFile
 * @param {function} onBeforeDirectory
 * @param {function} onAfterDirectory
 *
 * @todo add file filtering option
 */
FileWalker.prototype.process = function (directoryPath, onFile, onBeforeDirectory, onAfterDirectory) {
	directoryPath = (directoryPath || '.').replace(/\/?$/, '/');
	this._process(directoryPath, fs.absolute(directoryPath), onFile, onBeforeDirectory, onAfterDirectory);
};

/**
 *
 * @param {string} directoryPath
 * @param {function} onFile
 * @param {function} onBeforeDirectory
 * @param {function} onAfterDirectory
 * @protected
 */
FileWalker.prototype._process = function (directoryPath, absoluteDirectoryPath, onFile, onBeforeDirectory, onAfterDirectory) {
	var directory = fs.list(absoluteDirectoryPath);
	var directoryItem, absoluteDirectoryItem, i;
	for (i = 0; i < directory.length; i++) {
		if (directory[i] === '.' || directory[i] === '..') {
			continue;
		}
		directoryItem = directoryPath + directory[i];
		absoluteDirectoryItem = absoluteDirectoryPath + '/' + directory[i];
		if (fs.isLink(absoluteDirectoryItem)) {
			absoluteDirectoryItem = fs.readLink(absoluteDirectoryItem);
			if (system.os.name === 'windows' || system.os.name === 'winnt') {
				directoryItem = directoryItem.replace(/\.lnk$/, '');
			}
		}
		if (fs.isFile(absoluteDirectoryItem)) {
			if (onFile) {
				// @todo report depth
				onFile(directory[i], directoryItem, absoluteDirectoryItem);
			}
		} else if (fs.isDirectory(absoluteDirectoryItem)) {
			if (onBeforeDirectory) {
				onBeforeDirectory(directory[i], directoryItem, absoluteDirectoryItem);
			}
			this._process(directoryItem + '/', absoluteDirectoryItem, onFile, onBeforeDirectory, onAfterDiretory);
			if (onAfterDirectory) {
				onAfterDirectory(directory[i], directoryItem, absoluteDirectoryItem);
			}
		}
	}
}

module.exports = FileWalker;
