/**
 * Created by noam on 7/27/17.
 */
'use strict';
angular.module('demo', ['time-input']);
angular.module('demo').controller('ctrl', function ($scope) {
	$scope.mytime = new Date();
});