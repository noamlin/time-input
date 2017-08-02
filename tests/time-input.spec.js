/**
 * Created by noam on 8/1/17.
 */
'use strict';

describe('Time Input', function () {
	var $compile, $rootScope;

	beforeEach(module('time-input'));

	beforeEach(inject(function(_$compile_, _$rootScope_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$rootScope.testDate = new Date(2000, 5, 22, 6, 33, 54, 0); //2000-05-22 16:33:54.000 UTC
	}));

	it('template DOM', function () {
		var $elem = $compile('<span class="time-input" ng-model="testDate"></span>')($rootScope);
		$rootScope.$digest();
		var $childInputs = $elem.find('input');
		var $separators = $elem.find('span.separator');
		assert($childInputs.length === 3, 'has 3 inputs');
		assert($separators.length === 2, 'has 2 separators');
	});

	it('shows correct date', function () {
		$rootScope.testDate = new Date(2000, 5, 22, 6, 7, 8, 0);
		var $elem = $compile('<span class="time-input" ng-model="testDate"></span>')($rootScope);
		$rootScope.$digest();
		var $childInputs = $elem.find('input');
		assert($childInputs.eq(0).val() === '06', 'hours is displayed 06');
		assert($childInputs.eq(1).val() === '07', 'minutes is displayed 07');
		assert($childInputs.eq(2).val() === '08', 'seconds is displayed 08');
	});
});