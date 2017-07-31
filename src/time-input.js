/**
 * Created by barakedry on 24/04/2016.
 */

'use strict';
angular.module('time-input', []).directive('timeInput', [function() {
	return {
		template: '<input type="number" class="hours" placeholder="HH" min="0" max="23"><span class="separator"></span><input type="number" class="minutes" placeholder="MM" min="0" max="59"><span class="separator"></span><input type="number" class="seconds" placeholder="SS" min="0" max="59">',
		restrict: 'C',
		require: 'ngModel',
		controller: ['$scope', function ($scope) {
			//
		}],
		link: function (scope, element, attrs, ngModel) {
			var options = ngModel.$options || {};

			var $inputs = element.find('input'),
				$hoursInput = $inputs.eq(0),
				$minutesInput = $inputs.eq(1),
				$secondsInput;

			if (options.seconds !== false) {
				$secondsInput = $inputs.eq(2);
			} else {
				element.find('span.separator:last, input.seconds').remove();
			}

			function leadingZero(value) {
				value = parseInt(value, 10);
				if (value < 10) {
					return '0' + value;
				} else {
					return '' + value;
				}
			}

			$inputs.on('click',function() {
				this.select();
			});
			$inputs.on('focus',function() {
				element.addClass('focused');
			});
			$inputs.on('mousewheel',function() {
				//enables value increasing/decreasing via mouse wheel
			});

			$inputs.on('keydown', function (event) {
				var key = keyboardMap[event.keyCode];
				var permitted = ['1','2','3','4','5','6','7','8','9','0','NUMPAD1','NUMPAD2','NUMPAD3','NUMPAD4','NUMPAD5','NUMPAD6',
					'NUMPAD7','NUMPAD8','NUMPAD9','NUMPAD0','LEFT','RIGHT','UP','DOWN','DELETE','BACKSPACE','ENTER','SHIFT','TAB'];

				if (permitted.indexOf(key) === -1) {
					event.preventDefault();
				}
			});

			$inputs.on('paste cut', function(event) {
				event.preventDefault();
			});

			ngModel.$render = function render() {
				var date = ngModel.$viewValue;

				$hoursInput.val(leadingZero(date.getHours()));
				$minutesInput.val(leadingZero(date.getMinutes()));
				if (options.seconds !== false) {
					$secondsInput.val(leadingZero(date.getSeconds()));
				}
			};

			scope.$watch(attrs.disable, function (newVal) {
				if (newVal) {
					$hoursInput.attr('disabled','disabled');
					$minutesInput.attr('disabled','disabled');
					if (options.seconds !== false) {
						$secondsInput.attr('disabled', 'disabled');
					}
				} else {
					$hoursInput.removeAttr('disabled');
					$minutesInput.removeAttr('disabled');
					if (options.seconds !== false) {
						$secondsInput.removeAttr('disabled');
					}
				}
			});

			function shouldUpdateOnChange() {
				return options.updateOn === 'change';
			}

			function updateModel() {
				ngModel.$viewValue.setHours(parseInt($hoursInput.val(), 10));
				ngModel.$viewValue.setMinutes(parseInt($minutesInput.val(), 10));
				if (options.seconds !== false) {
					ngModel.$viewValue.setSeconds(parseInt($secondsInput.val(), 10));
				}
				ngModel.$setViewValue(ngModel.$viewValue);
				ngModel.$commitViewValue();
			}

			function inputChange(elem, varName) {
				return function inputChangeClosure() {
					if(!elem.value || isNaN(elem.value)) {
						elem.value = '00';
						updateModel();
						$(elem).select();
						return;
					}

					if(elem.value.length > 2) {
						switch(varName) {
							case 'hours': elem.value = leadingZero(ngModel.$viewValue.getHours()); break;
							case 'minutes': elem.value = leadingZero(ngModel.$viewValue.getMinutes()); break;
							case 'seconds': elem.value = leadingZero(ngModel.$viewValue.getSeconds()); break;
						}
						return;
					}

					if(Number(elem.value) > Number(elem.getAttribute('max'))) {
						elem.value = elem.value[0];
					}

					if (shouldUpdateOnChange()) {
						updateModel();
					}
				};
			}

			$hoursInput.on('input', inputChange($hoursInput.get(0), 'hours'));
			$minutesInput.on('input', inputChange($minutesInput.get(0), 'minutes'));

			function onKeyUp($nextInput) {
				return function (event) {
					var key = keyboardMap[event.keyCode];
					var permitted = ['1','2','3','4','5','6','7','8','9','0','NUMPAD1','NUMPAD2','NUMPAD3','NUMPAD4','NUMPAD5','NUMPAD6',
						'NUMPAD7','NUMPAD8','NUMPAD9','NUMPAD0'];

					if (key === 'ENTER' || (permitted.indexOf(key) >= 0 && Number(event.target.value) > 9)) {
						$nextInput.focus();
						$nextInput.select();
					}
				}
			}
			$hoursInput.on('keyup', onKeyUp($minutesInput));

			function onBlurInput() {
				element.removeClass('focused');
				this.value = leadingZero(Number(this.value));
				updateModel();
			}
			$hoursInput.on('blur', onBlurInput.bind($hoursInput.get(0)));
			$minutesInput.on('blur', onBlurInput.bind($minutesInput.get(0)));


			if (options.seconds !== false) {
				$minutesInput.on('keyup', onKeyUp($secondsInput));
				$secondsInput.on('input', inputChange($secondsInput.get(0), 'seconds'));
				$secondsInput.on('blur', onBlurInput.bind($secondsInput.get(0)));
			}
		}
	};
}]);