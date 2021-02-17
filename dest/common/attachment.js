"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAttachment = createAttachment;
exports.useMyAttachment = useMyAttachment;
exports.inputPropKey = void 0;

var _util = require("./util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// 生成 title, desc, error等附加部分
function createAttachment(content, cls) {
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (_util.lib.isString(content)) {
    return /*#__PURE__*/React.createElement("div", {
      className: cls
    }, content);
  }

  if (React.isValidElement(content)) {
    return React.cloneElement(content, {
      className: cls
    });
  }

  if (typeof ui_item !== 'undefined' && _util.lib.isPlainObject(content)) {
    var itemClass = content.itemClass ? content.itemClass + " ".concat(cls) : cls;
    content.itemClass = itemClass;
    return ui_item(content);
  }
}

var inputPropKey = ['title', 'desc', 'error', 'show', 'itemClass', 'itemStyle']; // let errorType = false
// function setErrorType(val){
//   errorType = val
// }

exports.inputPropKey = inputPropKey;

function useMyAttachment(itemConfig) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'item';
  var funKeys = {};
  var attributes = itemConfig.attributes || {};
  var properties = itemConfig.properties;
  var myrequired = properties.required;
  var inputPropBehavior = {};
  var timmer = null;

  var _useState = (0, _util.useState)(properties),
      _useState2 = _slicedToArray(_useState, 2),
      v = _useState2[0],
      setV = _useState2[1];

  var _useState3 = (0, _util.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      errorType = _useState4[0],
      setErrorType = _useState4[1];

  inputPropKey.forEach(function (ky) {
    var val = properties[ky];

    if (!_util.lib.isFunction(val)) {
      var n = ['set ' + ky, 'get ' + ky, ky];
      n = n.map(function (k) {
        return _util.lib.camelCase(k);
      });
      funKeys[ky] = n; // v = properties
      // setValue setClass setReadonly

      inputPropBehavior[n[0]] = function (param, cb) {
        v[ky] = ky === 'show' ? param === undefined ? true : param : param;
        if (timmer) clearTimeout(timmer); // v = properties

        timmer = setTimeout(function () {
          setV(_objectSpread({}, v), cb);
          timmer = null;
        }, 17);
      };

      inputPropBehavior[n[1]] = function () {
        return v[ky];
      };
    }
  });
  var context = {
    keys: [['setTitle', 'getTitle', 'title'], ['setDesc', 'getDesc', 'desc'], ['error', 'getError', 'error'], ['show', 'getShow', 'show']],
    setItemClass: function setItemClass(cls, cb) {
      inputPropBehavior.setItemClass(cls, cb);
    },
    setItemStyle: function setItemStyle(styl, cb) {
      inputPropBehavior.setItemStyle(styl, cb);
    },
    setTitle: function setTitle(param, cb) {
      inputPropBehavior.setTitle(param, cb);
    },
    setDesc: function setDesc(param, cb) {
      inputPropBehavior.setDesc(param, cb);
    },
    error: function error(param) {
      if (param) {
        inputPropBehavior.setError(param || properties.error);
        setErrorType('error');
      } else {
        this.removeError();
      }
    },
    removeError: function removeError() {
      inputPropBehavior.setError(properties.error);
      setErrorType('');
    },
    warn: function warn(param) {
      if (param) {
        inputPropBehavior.setError(param);
        setErrorType('warn');
      } else {
        this.removeError();
      }
    },
    info: function info(param) {
      if (param) {
        inputPropBehavior.setError(param);
        setErrorType('info');
      } else {
        this.removeError();
      }
    },
    show: function show(cb) {
      inputPropBehavior.setShow(true, cb);
    },
    hide: function hide(cb) {
      inputPropBehavior.setShow(false, cb);
    }
  };
  var dftcls = ['title', 'desc', 'error', 'required'];

  if (prefix) {
    dftcls = dftcls.map(function (item) {
      return prefix + '-' + item;
    });
  }

  var myshow = inputPropBehavior.getShow();
  var myItemClass = inputPropBehavior.getItemClass();
  var myItemStyle = inputPropBehavior.getItemStyle();
  var mytitle = createAttachment(inputPropBehavior.getTitle(), dftcls[0], attributes);
  var mydesc = createAttachment(inputPropBehavior.getDesc(), dftcls[1], attributes);
  var myerror = createAttachment(inputPropBehavior.getError(), dftcls[2] + ' ' + errorType, attributes);
  myrequired = myrequired ? myrequired === true ? /*#__PURE__*/React.createElement("div", {
    className: dftcls[3]
  }) : createAttachment(myrequired, dftcls[3], attributes) : false;
  return {
    funKeys: funKeys,
    context: context,
    // myItemClass: properties.itemClass,
    // myItemStyle: properties.itemStyle,
    myItemClass: myItemClass,
    myItemStyle: myItemStyle,
    myrequired: myrequired,
    mytitle: mytitle,
    mydesc: mydesc,
    myerror: myerror,
    myshow: myshow,
    errorType: errorType
  };
}