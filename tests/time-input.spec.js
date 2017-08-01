/**
 * Created by noam on 8/1/17.
 */
'use strict';

describe('Time Input', function () {
	beforeEach(module('time-input'));

	var $controller, $rootScope;

	beforeEach(inject(function(_$compile_, _$rootScope_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	it('test of test', function () {
		var $elem = $compile('<span class="time-input"></span>')($rootScope);
		$rootScope.$digest();
		console.log($elem.html());
	});
});