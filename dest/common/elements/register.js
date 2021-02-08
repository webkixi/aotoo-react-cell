"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInput = registerInput;
exports.getRegisterPart = getRegisterPart;

var _inputbody = require("./inputbody");

var _util = require("../util");

var whatLang = {}; // 注册组件

function _registerInput(isLang, types, FunctionComponent) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    if (_util.lib.isFunction(types)) {
      FunctionComponent = types;
      types = null;
    }

    if (_util.lib.isString(isLang) && (!types || _util.lib.isArray(types) || _util.lib.isString(types)) && _util.lib.isFunction(FunctionComponent)) {
      whatLang[isLang] = function (config) {
        types = types ? [].concat(types) : [];

        if (!types.length) {
          return [config, FunctionComponent, options];
        } else if (types.indexOf(config.type) > -1) {
          return [config, FunctionComponent, options];
        } else {
          return [config, null];
        }
      }; // 用户注册时生成独立的form表单，挂在form方法上


      var FC = function FC(props) {
        var iptConfig = props.data || {};

        if (!iptConfig.type) {
          // 强制指定组件类型
          iptConfig.type = types[0];
        }

        var parent = props.store || props.parent || (0, _util.createStore)();
        return /*#__PURE__*/React.createElement(_inputbody.InputBody, {
          data: iptConfig,
          entity: FunctionComponent,
          parent: parent
        });
      };

      return [isLang, FC, options];
    } else {
      throw new Error('注册参数填写错误');
    }
  } catch (error) {
    console.error(error);
  }
}

function registerInput(isLang, types, FunctionComponent) {
  // rule ? 
  if (_util.lib.isPlainObject(types)) {
    var $types = types.types;
    var $options = types.options || {};
    return _registerInput(isLang, $types, FunctionComponent, $options);
  } else {
    if (types) {
      if (!types.length) {
        console.warn("\u5FC5\u987B\u6307\u5B9A\u7EC4\u4EF6\u7C7B\u578B, \u5982['text', 'password']");
      } else {
        return _registerInput.apply(null, arguments);
      }
    }
  }
}

function getRegisterPart() {
  return whatLang;
}