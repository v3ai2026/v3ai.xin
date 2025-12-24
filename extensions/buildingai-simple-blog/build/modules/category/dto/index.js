'use strict';

var createCategory_dto = require('./create-category.dto');
var queryCategory_dto = require('./query-category.dto');
var updateCategory_dto = require('./update-category.dto');



Object.keys(createCategory_dto).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return createCategory_dto[k]; }
	});
});
Object.keys(queryCategory_dto).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return queryCategory_dto[k]; }
	});
});
Object.keys(updateCategory_dto).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return updateCategory_dto[k]; }
	});
});
