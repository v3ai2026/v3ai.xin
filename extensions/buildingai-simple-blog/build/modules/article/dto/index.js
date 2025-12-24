'use strict';

var createArticle_dto = require('./create-article.dto');
var queryArticle_dto = require('./query-article.dto');
var updateArticle_dto = require('./update-article.dto');



Object.keys(createArticle_dto).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return createArticle_dto[k]; }
	});
});
Object.keys(queryArticle_dto).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return queryArticle_dto[k]; }
	});
});
Object.keys(updateArticle_dto).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return updateArticle_dto[k]; }
	});
});
