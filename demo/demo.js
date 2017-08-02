/**
 * Created by noam on 7/27/17.
 */
'use strict';
angular.module('demo', ['time-input']);
angular.module('demo').controller('ctrl', function ($scope) {
	$scope.mytime = new Date();
	$scope.options1 = {
		liveUpdate: true,
		hours: true,
		minutes: true,
		seconds: true
	};

	$scope.options2 = JSON.parse(JSON.stringify($scope.options1));
	$scope.options2.liveUpdate = false;
	$scope.options2.seconds = false;

	$scope.options3 = JSON.parse(JSON.stringify($scope.options1));
	$scope.options3.liveUpdate = false;
	$scope.options3.hours = false;

	$scope.isDisabled = false;
});