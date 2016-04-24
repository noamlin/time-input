/**
 * Created by barakedry on 24/04/2016.
 */

'use strict';
angular.module('time-input', []).directive('timeInput', [function TimeInput() {
    return {
        template: '<input type="number" class="hour" placeholder="HH" min="0" max="24">:<input type="number" min="0" max="60" class="minute" placeholder="MM">',
        restrict: 'C',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            var $inputs = element.find('input'),
                $hourInput = $inputs.eq(0),
                $minuteInput = $inputs.eq(1),
                hours = 0,
                minutes = 0;

            function format(value) {
                if (value < 10) {
                    return '0' + value;
                } else {
                    return '' + value;
                }
            }

            ngModel.$render = function render() {
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

            function updateModel() {
                var date = ngModel.$viewValue;
                date.setMinutes(minutes);
                date.setHours(hours);
                ngModel.$setViewValue(date);
            }

            $hourInput.on('change', function onHourChange(e) {
                if (this.value && !isNaN(this.value)) {
                    hours = Math.abs(Number(this.value)) % 24;
                    this.value = format(hours);
                    this.select();

                    if (shouldUpdateOnChange()) {
                        updateModel();
                    }
                }
            });

            $minuteInput.on('change', function onMinuteChange(e) {
                if (this.value && !isNaN(this.value)) {
                    minutes = Math.abs(Number(this.value)) % 60;
                    this.value = format(minutes);
                    this.select();

                    if (shouldUpdateOnChange()) {
                        updateModel();
                    }
                }
            });

            $hourInput.on('blur', updateModel);
            $minuteInput.on('blur', updateModel);
        }
    };
}]);