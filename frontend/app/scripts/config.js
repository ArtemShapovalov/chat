/* global define */

define({
	appName: 'Chat',
	appDir: '/scripts',
    bowerDir: '/bower_components',
	libDir: '/js/lib',
	routes: {
		'/main' : 'chat/Main',
        '/chat': 'chat/Chat'
	},
	defaultRedirect: '/main'
});