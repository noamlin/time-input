/**
 * Created by barakedry on 24/04/2016.
 */

'use strict';
angular.module('time-input', []).directive('timeInput', [function TimeInput() {
	return {
		template: '<input type="number" class="hour" placeholder="HH" min="0" max="24"><span class="divider">:</span><input type="number" class="minute" placeholder="MM" min="0" max="60">',
		restrict: 'C',
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
			var $inputs = element.find('input'),
				$hourInput = $inputs.eq(0),
				$minuteInput = $inputs.eq(1),
				hours = 0,
				minutes = 0,
				afterBlur;

			function format(value) {
				if (value < 10) {
					return '0' + value;
				} else {
					return '' + value;
				}
			}

			scope.$watch(attrs.ngDisabled, function(value) {
				$inputs.prop('disabled', value);
			});

			scope.$watch(attrs.selectOnFocus, function(value) {
				if (value) {
					$inputs.unbind('focus').bind('focus', function () {
						this.select();
					});
				}
			});

			ngModel.$render = function render() {
				if(!(ngModel.$viewValue instanceof Date)) {
					return;
				}
				var date = ngModel.$viewValue;

				hours = date.getHours();
				minutes = date.getMinutes();

				$hourInput.val(format(hours));
				$minuteInput.val(format(minutes));
			};

			function shouldUpdateOnChange() {
				return !(ngModel.$options &&
				ngModel.$options.updateOn &&
				ngModel.$options.updateOn.indexOf('default') === -1);

			}

			function updateModel(e) {
				afterBlur = !!e;
				var date = ngModel.$viewValue;
				date.setMinutes(minutes);
				date.setHours(hours);
				ngModel.$setViewValue(date);
				ngModel.$commitViewValue();
			}

			$hourInput.on('change', function onHourChange(/*e*/) {
				if (this.value && !isNaN(this.value)) {
					hours = Math.abs(Number(this.value)) % 24;
					this.value = format(hours);
					if (!afterBlur) {
						this.select();
					}

					if (shouldUpdateOnChange()) {
						updateModel();
					}
				}
			});

			$minuteInput.on('change', function onMinuteChange(/*e*/) {
				if (this.value && !isNaN(this.value)) {
					minutes = Math.abs(Number(this.value)) % 60;
					this.value = format(minutes);
					if (!afterBlur) {
						this.select();
					}

					if (shouldUpdateOnChange()) {
						updateModel();
					}
				}
			});

			function handleBlur() {
				if($hourInput.val() === '') {
					$hourInput.val(format(hours));
				}
				if($minuteInput.val() === '') {
					$minuteInput.val(format(minutes));
				}
				updateModel();
			}

			$hourInput.on('blur', handleBlur);
			$minuteInput.on('blur', handleBlur);
		}
	};
}]);