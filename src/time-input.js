/**
 * Created by barakedry on 24/04/2016.
 */

'use strict';
angular.module('time-input', []).directive('timeInput', [function() {
	return {
		template: '<input type="number" class="hours" placeholder="HH" min="0" max="23">:<input type="number" class="minutes" placeholder="MM" min="0" max="59">:<input type="number" class="seconds" placeholder="SS" min="0" max="59">',
		restrict: 'C',
		require: 'ngModel',
		controller: ['$scope', function ($scope) {
			$scope.timeObject = {
				hours : 0,
				minutes : 0,
				seconds : 0,
				lastValidHours: 0,
				lastValidMinutes: 0,
				lastValidSeconds: 0
			};
		}],
		link: function (scope, element, attrs, ngModel) {
			var $inputs = element.find('input'),
				$hourInput = $inputs.eq(0),
				$minuteInput = $inputs.eq(1),
				$secondsInput = $inputs.eq(2),
				mousewheel = false,
				timeout;

			function leadingZero(value) {
				if (value < 10) {
					return '0' + value;
				} else {
					return '' + value;
				}
			}

			$('input', element).on('click',function() {
				this.select();
			});

			$('input', element).on('focus',function(){
				element.addClass('focused');
			});
			$('input', element).on('mousewheel',function(){
				mousewheel = true;
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					mousewheel = false;
				},500);
			});

			$('input', element).bind('keydown', function (event) {
				var key = event.keyCode;
				//if  0-9 also or 0-9(numpad) or backspace or delete or arrows
				if (!(( key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 46 || (key >= 37 && key <= 40))) {
					event.preventDefault();
				}
			});

			$('input', element).bind('paste cut', function(event) {
				event.preventDefault();
			});

			ngModel.$render = function render() {
				var date = ngModel.$viewValue;

				scope.timeObject.hours = date.getHours();
				scope.timeObject.minutes = date.getMinutes();
				scope.timeObject.seconds = date.getSeconds();

				scope.timeObject.lastValidHours =  scope.timeObject.hours;
				scope.timeObject.lastValidMinutes = scope.timeObject.minutes;
				scope.timeObject.lastValidSeconds = scope.timeObject.seconds;

				$hourInput.val(leadingZero(scope.timeObject.hours));
				$minuteInput.val(leadingZero(scope.timeObject.minutes));
				$secondsInput.val(leadingZero(scope.timeObject.seconds));
			};

			scope.$watch(attrs.disable, function (newVal) {
				if(newVal) {
					$hourInput.attr('disabled','disabled');
					$minuteInput.attr('disabled','disabled');
					$secondsInput.attr('disabled','disabled');
				}else{
					$hourInput.removeAttr('disabled');
					$minuteInput.removeAttr('disabled');
					$secondsInput.removeAttr('disabled');
				}
			});

			function shouldUpdateOnChange() {
				return !(ngModel.$options &&
				ngModel.$options.updateOn &&
				ngModel.$options.updateOn.indexOf('default') === -1);

			}

			function updateModel() {
				var date = ngModel.$viewValue;
				date.setSeconds(scope.timeObject.seconds);
				date.setMinutes(scope.timeObject.minutes);
				date.setHours(scope.timeObject.hours);
				ngModel.$setViewValue(date);
				ngModel.$commitViewValue();
			}

			function inputChange(elem, varName) {
				return function inputChangeClosure() {
					if(!elem.value || isNaN(elem.value)){
						scope.timeObject[varName] = 0;
						scope.timeObject['lastValid' + varName] = 0;
						elem.value = '00';
						updateModel();
						$(elem).select();
						return;
					}

					if(elem.value.length > 2){
						elem.value = leadingZero(scope.timeObject['lastValid' + varName]);
						return;
					}
					if(Number(elem.value)> Number(elem.getAttribute('max'))) {
						elem.value = elem.value[0];
					}
					scope.timeObject[varName] = Number(elem.value);
					if ((elem.value.length === 2 || elem.value > Number(elem.getAttribute('max')[0])) && !mousewheel) {
						elem.value = leadingZero(scope.timeObject[varName]);
					}
					if(mousewheel) {
						elem.value = leadingZero(scope.timeObject[varName]);
					}
					scope.timeObject['lastValid' + varName] = scope.timeObject[varName];
					if (shouldUpdateOnChange()) {
						updateModel();
					}

				};
			}

			$hourInput.bind('input', inputChange($hourInput.get(0), 'hours'));
			$minuteInput.bind('input', inputChange($minuteInput.get(0), 'minutes'));
			$secondsInput.bind('input', inputChange($secondsInput.get(0), 'seconds'));

			function onKeyUp($nextInput) {
				return function (event) {
					var key = event.keyCode;
					//if  0-9 also or 0-9(numpad)
					if (( key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
						if (Number(event.target.value) > 9) {
							$nextInput.focus();
							$nextInput.select();
						}
					}
				}
			}
			$hourInput.bind('keyup', onKeyUp($minuteInput));
			$minuteInput.bind('keyup', onKeyUp($secondsInput));

			function onBlurInput() {
				element.removeClass('focused');
				this.value = leadingZero(Number(this.value));
				updateModel();
			}
			$hourInput.on('blur', onBlurInput.bind($hourInput.get(0)));
			$minuteInput.on('blur', onBlurInput.bind($minuteInput.get(0)));
			$secondsInput.on('blur', onBlurInput.bind($secondsInput.get(0)));
		}
	};
}]);