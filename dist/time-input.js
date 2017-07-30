"use strict";

angular.module("time-input", []).directive("timeInput", [ function() {
  return {
    template: '<input type="number" class="hours" placeholder="HH" min="0" max="23">:<input type="number" class="minutes" placeholder="MM" min="0" max="59">:<input type="number" class="seconds" placeholder="SS" min="0" max="59">',
    restrict: "C",
    require: "ngModel",
    controller: [ "$scope", function($scope) {} ],
    link: function(scope, element, attrs, ngModel) {
      var $inputs = element.find("input"), $hoursInput = $inputs.eq(0), $minutesInput = $inputs.eq(1), $secondsInput = $inputs.eq(2);
      function leadingZero(value) {
        value = parseInt(value, 10);
        if (value < 10) {
          return "0" + value;
        } else {
          return "" + value;
        }
      }
      $inputs.on("click", function() {
        this.select();
      });
      $inputs.on("focus", function() {
        element.addClass("focused");
      });
      $inputs.on("mousewheel", function() {});
      $inputs.on("keydown", function(event) {
        var key = event.keyCode;
        if (!(key >= 48 && key <= 57 || key >= 96 && key <= 105 || key === 8 || key === 46 || key >= 37 && key <= 40)) {
          event.preventDefault();
        }
      });
      $inputs.on("paste cut", function(event) {
        event.preventDefault();
      });
      ngModel.$render = function render() {
        var date = ngModel.$viewValue;
        $hoursInput.val(leadingZero(date.getHours()));
        $minutesInput.val(leadingZero(date.getMinutes()));
        $secondsInput.val(leadingZero(date.getSeconds()));
      };
      scope.$watch(attrs.disable, function(newVal) {
        if (newVal) {
          $hoursInput.attr("disabled", "disabled");
          $minutesInput.attr("disabled", "disabled");
          $secondsInput.attr("disabled", "disabled");
        } else {
          $hoursInput.removeAttr("disabled");
          $minutesInput.removeAttr("disabled");
          $secondsInput.removeAttr("disabled");
        }
      });
      function shouldUpdateOnChange() {
        return ngModel.$options && ngModel.$options.updateOnChange === true;
      }
      function updateModel() {
        ngModel.$viewValue.setHours(parseInt($hoursInput.val(), 10));
        ngModel.$viewValue.setMinutes(parseInt($minutesInput.val(), 10));
        ngModel.$viewValue.setSeconds(parseInt($secondsInput.val(), 10));
        ngModel.$setViewValue(ngModel.$viewValue);
        ngModel.$commitViewValue();
      }
      function inputChange(elem, varName) {
        return function inputChangeClosure() {
          if (!elem.value || isNaN(elem.value)) {
            elem.value = "00";
            updateModel();
            $(elem).select();
            return;
          }
          if (elem.value.length > 2) {
            switch (varName) {
             case "hours":
              elem.value = leadingZero(ngModel.$viewValue.getHours());
              break;

             case "minutes":
              elem.value = leadingZero(ngModel.$viewValue.getMinutes());
              break;

             case "seconds":
              elem.value = leadingZero(ngModel.$viewValue.getSeconds());
              break;
            }
            return;
          }
          if (Number(elem.value) > Number(elem.getAttribute("max"))) {
            elem.value = elem.value[0];
          }
          if (shouldUpdateOnChange()) {
            updateModel();
          }
        };
      }
      $hoursInput.on("input", inputChange($hoursInput.get(0), "hours"));
      $minutesInput.on("input", inputChange($minutesInput.get(0), "minutes"));
      $secondsInput.on("input", inputChange($secondsInput.get(0), "seconds"));
      function onKeyUp($nextInput) {
        return function(event) {
          var key = event.keyCode;
          if (key >= 48 && key <= 57 || key >= 96 && key <= 105) {
            if (Number(event.target.value) > 9) {
              $nextInput.focus();
              $nextInput.select();
            }
          }
        };
      }
      $hoursInput.on("keyup", onKeyUp($minutesInput));
      $minutesInput.on("keyup", onKeyUp($secondsInput));
      function onBlurInput() {
        element.removeClass("focused");
        this.value = leadingZero(Number(this.value));
        updateModel();
      }
      $hoursInput.on("blur", onBlurInput.bind($hoursInput.get(0)));
      $minutesInput.on("blur", onBlurInput.bind($minutesInput.get(0)));
      $secondsInput.on("blur", onBlurInput.bind($secondsInput.get(0)));
    }
  };
} ]);