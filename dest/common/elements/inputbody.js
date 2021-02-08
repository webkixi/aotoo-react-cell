"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputBody = InputBody;

var _util = require("../util");

var _dataparser = require("../dataparser");

var _attachment = require("../attachment");

var _attributes = require("../attributes");

var _events = require("../events");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function InputBody(props) {
  var parent = props.parent || props.store || {};
  var InputEntity = props.entity; // 注册组件

  var _useState = (0, _util.useState)(function () {
    return props.from ? props.data : function () {
      return (0, _dataparser.inputParser)(props.data);
    }();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      inputConfig = _useState2[0],
      setInputConfig = _useState2[1];

  var uniqId = inputConfig.uniqId;
  React.useEffect(function () {
    var iptConfig = props.from ? props.data : function () {
      return (0, _dataparser.inputParser)(props.data);
    }();
    setAttribute(iptConfig.attributes);
  }, [props.data]); // let [ inputContext, attributesContext, attributesFunKeys ] = createAttrState(inputConfig)
  // let { myrequired, myItemClass, myItemStyle, mytitle, mydesc, myerror, myshow, errorType, context, funKeys } = useMyAttachment(inputConfig)
  // let [attr, setAttribute] = React.useState(inputConfig)

  var _useState3 = (0, _util.useState)(function () {
    return inputConfig.attributes || {};
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      attr = _useState4[0],
      setAttribute = _useState4[1];

  var _createAttrState = (0, _attributes.createAttrState)(inputConfig.id, attr, setAttribute),
      _createAttrState2 = _slicedToArray(_createAttrState, 3),
      inputContext = _createAttrState2[0],
      attributesContext = _createAttrState2[1],
      attributesFunKeys = _createAttrState2[2];

  var _useMyAttachment = (0, _attachment.useMyAttachment)(inputConfig),
      myrequired = _useMyAttachment.myrequired,
      myItemClass = _useMyAttachment.myItemClass,
      myItemStyle = _useMyAttachment.myItemStyle,
      mytitle = _useMyAttachment.mytitle,
      mydesc = _useMyAttachment.mydesc,
      myerror = _useMyAttachment.myerror,
      myshow = _useMyAttachment.myshow,
      errorType = _useMyAttachment.errorType,
      context = _useMyAttachment.context,
      funKeys = _useMyAttachment.funKeys;

  inputConfig.attributes = attr;
  var allFunkeys = Object.assign({}, funKeys, attributesFunKeys);
  var mycontext = Object.assign({}, context, inputContext, attributesContext); // attr方法仿jquery的attr方法

  mycontext.attr = function (ky, val, cb) {
    if (ky) {
      var fn = typeof val !== 'undefined' ? allFunkeys[ky][0] : allFunkeys[ky][1];

      if (attributesContext[fn]) {
        if (inputContext[fn] || context[fn]) {
          console.warn("".concat(fn, "\u65B9\u6CD5\u5C06\u8986\u76D6\u540C\u540D\u65B9\u6CD5\uFF0C\u8BF7\u533A\u5206\u5C5E\u6027\u547D\u540D"), props.data);
        }
      }

      var fun = mycontext[fn];
      return fn && fun && fun(val, cb);
    }
  };

  mycontext.save = function (e, cb) {
    var readOnly = e.target.readOnly;
    var disabled = e.target.disabled;

    if (readOnly || disabled) {
      return;
    }

    mycontext.setValue(e.target.value, cb);
  };

  var attributes = (0, _events.supplementEvents)(inputConfig, mycontext, parent);
  attributes.className = attributes.className ? attributes.className.indexOf('input') === 0 ? attributes.className : "input ".concat(attributes.className) : 'input';
  parent.ctx.elements[attributes.id] = mycontext;

  if (attributes.name) {
    parent.ctx.elements[attributes.name] = mycontext;
  }

  attributes.store = mycontext; // InputEntity = InputEntity || <input {...attributes} />

  InputEntity = InputEntity ? React.isValidElement(InputEntity) ? InputEntity : /*#__PURE__*/React.createElement(InputEntity, attributes) : /*#__PURE__*/React.createElement("input", attributes);
  return myshow ? /*#__PURE__*/React.createElement("div", {
    className: "line-item ".concat(myItemClass || ''),
    style: myItemStyle
  }, myrequired && myrequired.UI ? /*#__PURE__*/React.createElement(myrequired.UI, null) : myrequired, mytitle && mytitle.UI ? /*#__PURE__*/React.createElement(mytitle.UI, null) : mytitle, /*#__PURE__*/React.createElement("div", {
    className: "item-entity"
  }, InputEntity, myerror && myerror.UI ? /*#__PURE__*/React.createElement(myerror.UI, null) : myerror
  /* success , warning, error info */
  ), mydesc && mydesc.UI ? /*#__PURE__*/React.createElement(mydesc.UI, null) : mydesc) : null;
}