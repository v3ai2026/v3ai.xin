'use strict';

var app_module = require('./modules/app.module');



Object.keys(app_module).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return app_module[k]; }
	});
});
