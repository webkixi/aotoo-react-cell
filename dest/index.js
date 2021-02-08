"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
Object.defineProperty(exports, "createStore", {
  enumerable: true,
  get: function get() {
    return _util.createStore;
  }
});
Object.defineProperty(exports, "CellBlock", {
  enumerable: true,
  get: function get() {
    return _form.CellBlock;
  }
});
Object.defineProperty(exports, "CellGroup", {
  enumerable: true,
  get: function get() {
    return _form.CellGroup;
  }
});
exports.default = void 0;

var _aotoo = _interopRequireDefault(require("@aotoo/aotoo"));

var _util = require("./common/util");

var _form = require("./form");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function register() {
  var res = _form.registerInput.apply(null, arguments);

  if (res) {
    var _res = _slicedToArray(res, 3),
        isLang = _res[0],
        FC = _res[1],
        options = _res[2];

    cell[isLang] = function RegisterComponentWrap(props) {
      return /*#__PURE__*/React.createElement(FC, _extends({}, props, {
        registeroptions: options
      }));
    };
  }
}
/**
 * $$id,
 * show,
 * data: [
 *   {
 *    show, 
 *    itemClass, 
 *    itemStyle, 
 *    title: '' || {} || <xxx />,   
 *    desc: '', 
 *    required: false
 *    input: [
 *      {show, itemClass, itemStyle, title, type, name, id, error, desc, tip, required, ...events}]
 *    }
 * ]
 */


function template(state, props, $ref) {
  return /*#__PURE__*/React.createElement(_form.CellGroup, {
    data: state.data,
    context: this,
    state: state
  });
}

function cell(options) {
  var formConfig = {
    ctx: {
      elements: {},
      group: {}
    },
    _dynamicUnion: {},
    data: {},
    created: function created() {
      var $data = this.getData();
      this.oriData = _util.lib.cloneDeep($data);
    },
    getData: function getData() {},
    attached: function attached() {},
    ready: function ready() {},
    detached: function detached() {}
  };
  var target = {
    data: []
  };

  if (_util.lib.isArray(options)) {
    target.data = options;
  } else {
    target = Object.assign(target, options);
  }

  formConfig.data = target;
  return (0, _aotoo.default)(formConfig, template);
} // 内部默认表单组件 input text


function TextInput(props) {
  return /*#__PURE__*/React.createElement("input", props);
}

register('Text', ['text', 'number', 'telephone', 'password'], TextInput);
var _default = cell;
exports.default = _default;