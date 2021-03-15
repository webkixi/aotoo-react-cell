"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputParser = inputParser;
exports.formParser = formParser;
exports.inputPropertieKey = void 0;

var _util = require("./util");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var inputPropertieKey = ['title', 'desc', 'required', 'error', 'tip', 'itemClass', 'itemStyle', 'itemMethod', 'show', 'union'];
/**
 * 重新组合input element的描述属性
 * @param {Object} ipt 用户传入的表单描述属性
 * @param {*} item 
 * @param {*} parent 
 */

exports.inputPropertieKey = inputPropertieKey;

function inputParser(ipt, gid, parent) {
  try {
    var properties = {
      unionResponse: []
    };
    var attributes = {};
    var events = {};

    var id = ipt.id || ipt.name || function () {
      console.warn('请正确指定表单元素的id，可能会引起一些问题');
      return _util.lib.uniqueId('input-id-');
    }();

    var name = ipt.name;
    var type = ipt.type || 'text';
    var union = ipt.union;

    var uniqId = ipt.uniqId || _util.lib.uniqueId('input-element-'); // let key = 'input-key-' + id ? id : uniqId;


    var key = 'input-key-' + id;
    properties.show = ipt.hasOwnProperty('show') ? show : true;
    properties.key = key;
    ipt.value = ipt.value || '';
    Object.keys(ipt).forEach(function (ky) {
      if (inputPropertieKey.indexOf(ky) > -1) {
        properties[ky] = ipt[ky];
      } else if (_util.lib.isEvent(ky)) {
        events[ky] = ipt[ky];
      } else {
        attributes[ky] = ipt[ky];
      }
    });
    attributes.id = id;
    attributes.name = name;
    return {
      id: id,
      // input id
      groupId: gid,
      name: name,
      // input name
      type: type,
      // uniqId, // input 唯一id
      events: events,
      properties: properties,
      // input 的外围属性
      attributes: attributes // input 内置属性

    };
  } catch (error) {}
}

function createUnionResponse(union, $data, input) {
  var _union = _slicedToArray(union, 3),
      targetId = _union[0],
      evtKey = _union[1],
      unionCallback = _union[2];

  if (_util.lib.isFunction(evtKey)) {
    unionCallback = evtKey;
    evtKey = null;
  }

  if (targetId && _util.lib.isFunction(unionCallback)) {
    $data.forEach(function (item) {
      return item.input.forEach(function (ipt) {
        if (ipt.id === targetId) ipt.properties.unionResponse.push([evtKey, unionCallback, input.id]);
      });
    });
  }

  return $data;
} // 解析用户输入的表单数据


function formParser() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var parent = arguments.length > 1 ? arguments[1] : undefined;
  var $data = [];
  var $unions = [];
  data.forEach(function (item) {
    // item 为 group-line 数据
    var $item = _objectSpread({}, item);

    $item.groupId = $item.gid || $item.groupId || _util.lib.uniqueId('line-of-form-'); // 用于快速定位data中的那一组表单

    item.gid = $item.groupId; // 将gid反射回原始数据

    $item.key = 'gkey-' + ($item.id || $item.groupId);
    $item.show = $item.hasOwnProperty('show') ? $item.show : true;
    var inputs = $item.input || $item.cells;

    if (inputs) {
      inputs = [].concat(inputs);

      var $inputs = _toConsumableArray(inputs);

      $inputs = $inputs.map(function (input, ii) {
        var $input = inputParser(input, $item.groupId, parent);
        var properties = $input.properties;

        if (_util.lib.isArray(properties.union)) {
          $unions.push($input);
        }

        return $input;
      });
      $item.input = $inputs;
      delete $item.cells;
      $data.push($item);
    }
  });

  if ($unions.length) {
    $unions.forEach(function (input) {
      var union = input.properties.union;
      var multipyUnion = [];
      union.forEach(function (un) {
        if (_util.lib.isArray(un)) multipyUnion.push(un); // 允许监听多个id
      });

      if (multipyUnion.length) {
        multipyUnion.forEach(function (un) {
          $data = createUnionResponse(un, $data, input);
        });
      } else {
        $data = createUnionResponse(union, $data, input);
      }
    });
  }

  return $data;
}