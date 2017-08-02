"use strict";

angular.module("time-input", []).directive("timeInput", [ function() {
  return {
    template: '<input type="number" class="hours" placeholder="HH" min="0" max="23"><span class="separator"></span><input type="number" class="minutes" placeholder="MM" min="0" max="59"><span class="separator"></span><input type="number" class="seconds" placeholder="SS" min="0" max="59">',
    restrict: "C",
    require: "ngModel",
    scope: {
      options: "=?"
    },
    controller: [ "$scope", function($scope) {
      $scope.options = $scope.options || {};
      if (typeof $scope.options.liveUpdate === "undefined") {
        $scope.options.liveUpdate = false;
      }
      if (typeof $scope.options.hours === "undefined") {
        $scope.options.hours = true;
      }
      if (typeof $scope.options.minutes === "undefined") {
        $scope.options.minutes = true;
      }
      if (typeof $scope.options.seconds === "undefined") {
        $scope.options.seconds = true;
      }
    } ],
    link: function(scope, element, attrs, ngModel) {
      var inputTypes = [ "hours", "minutes", "seconds" ];
      var getFuncs = [ "getHours", "getMinutes", "getSeconds" ];
      var setFuncs = [ "setHours", "setMinutes", "setSeconds" ];
      var $separators = element.find("span.separator");
      var $inputs = element.find("input");
      var inputs = {};
      var i, inputType, getFunc, setFunc, nextInput;
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
        var key = keyboardMap[event.keyCode];
        var permitted = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "NUMPAD0", "LEFT", "RIGHT", "UP", "DOWN", "DELETE", "BACKSPACE", "ENTER", "SHIFT", "TAB" ];
        if (permitted.indexOf(key) === -1) {
          event.preventDefault();
        }
      });
      $inputs.on("paste cut", function(event) {
        event.preventDefault();
      });
      ngModel.$render = function render() {
        var date = ngModel.$viewValue;
        for (i = 0; i < inputTypes.length; i++) {
          inputType = inputTypes[i];
          getFunc = getFuncs[i];
          if (scope.options[inputType] !== false) {
            inputs[inputType].val(leadingZero(date[getFunc]()));
          }
        }
      };
      scope.$watch(attrs.disable, function(newVal) {
        if (newVal) {
          for (i = 0; i < inputTypes.length; i++) {
            inputType = inputTypes[i];
            if (scope.options[inputType] !== false) {
              inputs[inputType].attr("disabled", "disabled");
            }
          }
        } else {
          for (i = 0; i < inputTypes.length; i++) {
            inputType = inputTypes[i];
            if (scope.options[inputType] !== false) {
              inputs[inputType].removeAttr("disabled");
            }
          }
        }
      });
      function updateModel() {
        for (i = 0; i < inputTypes.length; i++) {
          inputType = inputTypes[i];
          setFunc = setFuncs[i];
          if (scope.options[inputType] !== false) {
            ngModel.$viewValue[setFunc](parseInt(inputs[inputType].val(), 10));
          }
        }
        ngModel.$setViewValue(ngModel.$viewValue);
        ngModel.$commitViewValue();
      }
      function inputChange(elem) {
        return function inputChangeClosure() {
          if (!elem.value || isNaN(elem.value)) {
            elem.value = "00";
            updateModel();
            $(elem).select();
            return;
          }
          var numValue = parseInt(elem.value, 10);
          var maxValue = parseInt(elem.getAttribute("max"), 10);
          if (numValue > maxValue) {
            elem.value = maxValue;
          }
          if (scope.options.liveUpdate === true) {
            updateModel();
          }
        };
      }
      function selectNext($elm) {
        $elm.get(0).disableKeyUp = true;
        setTimeout(function() {
          $elm.get(0).disableKeyUp = false;
        }, 250);
        $elm.focus().select();
      }
      function onKeyUp($nextInput) {
        return function(event) {
          if (event.target.disableKeyUp === true) {
            return;
          }
          var key = keyboardMap[event.keyCode];
          var permitted = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "NUMPAD0" ];
          if (key === "ENTER") {
            if (!$nextInput) {
              event.target.blur();
            } else {
              selectNext($nextInput);
            }
          } else if ($nextInput && permitted.indexOf(key) >= 0 && event.target.value.length > 1) {
            selectNext($nextInput);
          }
        };
      }
      function onBlurInput() {
        element.removeClass("focused");
        this.value = leadingZero(Number(this.value));
        updateModel();
      }
      for (i = 0; i < inputTypes.length; i++) {
        inputType = inputTypes[i];
        inputs[inputType] = $inputs.eq(i);
        if (scope.options[inputType] === false) {
          inputs[inputType].remove();
          if (i === 0) {
            $separators.eq(0).remove();
          } else if (i === 2) {
            $separators.eq(1).remove();
          }
        }
        if (scope.options[inputType] !== false) {
          inputs[inputType].on("input", inputChange(inputs[inputType].get(0)));
          nextInput = inputTypes[i + 1];
          if (inputs[nextInput] && scope.options[nextInput] !== false) {
            inputs[inputType].on("keyup", onKeyUp(inputs[inputTypes[i + 1]]));
          } else {
            inputs[inputType].on("keyup", onKeyUp());
          }
          inputs[inputType].on("blur", onBlurInput.bind(inputs[inputType].get(0)));
        }
      }
    }
  };
} ]);