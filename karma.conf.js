'use strict';

module.exports = function (config) {
	config.set({
		//base path, that will be used to resolve files and exclude
		basePath: '',

		//testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['mocha', 'sinon-chai'],

		//list of files / patterns to load in the browser
		files: [
			'bower_components/stork-shims/dist/shims.js',
			'demo/jquery.min.js',
			'bower_components/angular/angular.min.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'dist/time-input.css',
			'dist/time-input.js',
			'tests/**/*.css',
			'tests/**/*.js'
		],

		//list of files / patterns to exclude
		exclude: [],

		preprocessors: {},

		ngHtml2JsPreprocessor: {},

		//web server port
		port: 8080,

		//level of logging. possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		//reporter types:
		//- dots
		//- progress (default)
		//- spec (karma-spec-reporter)
		//- junit
		//- growl
		//- coverage
		reporters: ['coverage'],

		//enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		//Start these browsers, currently available:
		//- Chrome
		//- ChromeCanary
		//- Firefox
		//- Opera
		//- Safari (only Mac)
		//- PhantomJS
		//- IE (only Windows)
		browsers: ['PhantomJS'],

		//Continuous Integration mode. if true, it capture browsers, run tests and exit
		singleRun: false
	});
};
