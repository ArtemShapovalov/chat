/* global require, angular */

require(['config'], function(config) {
	
	'use strict';
	require.config({
		baseUrl: config.appDir,
		paths: {
			app: config.appDir + '/app',
            angular: config.bowerDir + '/angular/angular',
            angularRoute: config.bowerDir + '/angular-route/angular-route',
            angularScrollGlue: config.bowerDir + '/angular-scroll-glue/src/scrollglue',
		},
        shim: {
            app: {
                deps:['angular', 'angularRoute', 'angularScrollGlue']
            },
            angularScrollGlue: {
                deps:['angular']
            },
            angularRoute: {
                deps:['angular']
            }
        }
	});
	
	require(
		[
			'app',
			'services/chatService'
		],
		function (app) {
			angular.bootstrap(document, [app.name]);
		});

});