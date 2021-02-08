"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WhatTypeInput = WhatTypeInput;

var _inputbody = require("./inputbody");

var _util = require("../util");

var _register = require("./register");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function WhatTypeInput(props) {
  var inputConfig = props.data;
  var parent = props.store || props.parent;
  var target = null;
  var whatLang = (0, _register.getRegisterPart)();
  var langs = Object.keys(whatLang);

  var _loop = function _loop(ii) {
    var isLang = langs[ii];

    var _whatLang$isLang = whatLang[isLang](inputConfig),
        _whatLang$isLang2 = _slicedToArray(_whatLang$isLang, 3),
        iptConfig = _whatLang$isLang2[0],
        X = _whatLang$isLang2[1],
        options = _whatLang$isLang2[2];

    if (X) {
      var Y = function Y(props) {
        return /*#__PURE__*/React.createElement(X, _extends({}, props, {
          registeroptions: options
        }));
      };

      target = /*#__PURE__*/React.createElement(_inputbody.InputBody, {
        data: iptConfig,
        entity: Y,
        parent: parent,
        from: 'form'
      });
      return "break";
    }
  };

  for (var ii = 0; ii < langs.length; ii++) {
    var _ret = _loop(ii);

    if (_ret === "break") break;
  }

  return target;
}