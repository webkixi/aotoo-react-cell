"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormBlock = FormBlock;
exports.FormGroup = FormGroup;
Object.defineProperty(exports, "TextInput", {
  enumerable: true,
  get: function get() {
    return _inputbody.TextInput;
  }
});
Object.defineProperty(exports, "registerInput", {
  enumerable: true,
  get: function get() {
    return _register.registerInput;
  }
});
exports.CellBlock = exports.CellGroup = void 0;

var _attachment = require("./common/attachment");

var _dataparser = require("./common/dataparser");

var _util = require("./common/util");

var _inputbody = require("./common/elements/inputbody");

var _whatinput = require("./common/elements/whatinput");

var _register = require("./common/elements/register");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function addUnionListen(union, input, parent) {
  var _union = _slicedToArray(union, 3),
      targetId = _union[0],
      evtKey = _union[1],
      unionCallback = _union[2];

  if (_util.lib.isFunction(evtKey)) {
    unionCallback = evtKey;
    evtKey = null;
  }

  if (targetId && _util.lib.isFunction(unionCallback)) {
    var idf = 'response-' + targetId + '-' + input.id;
    parent._dynamicUnion[idf] = [evtKey, unionCallback, input.id];
    parent._dynamicUnion[input.id] = idf; // 在删除该input时，同时删除该id的监听回调方法
  }
}

function dynamicUnion(ipt, parent) {
  // 动态数据添加的联动回调方法
  if (ipt && ipt.properties.union) {
    var $unions = [ipt];
    $unions.forEach(function (input) {
      var union = input.properties.union;
      var multipyUnion = [];
      union.forEach(function (un) {
        if (_util.lib.isArray(un)) multipyUnion.push(un); // 允许监听多个id
      });

      if (multipyUnion.length) {
        multipyUnion.forEach(function (un) {
          return addUnionListen(un, input, parent);
        });
      } else {
        addUnionListen(union, input, parent);
      }
    });
  }
}

function FormBlock(props) {
  var myElements = [];
  var parent = props.parent || props.store || (0, _util.createStore)();

  var _useState = (0, _util.useState)(function () {
    return props.from ? props.data : function () {
      return (0, _dataparser.formParser)([props.data], parent)[0];
    }();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      item = _useState2[0],
      setItem = _useState2[1];

  var groupId = item.groupId;
  var tmpConfig = {
    attributes: {},
    properties: item
  };

  var _useState3 = (0, _util.useState)(tmpConfig.properties.input),
      _useState4 = _slicedToArray(_useState3, 2),
      inputElements = _useState4[0],
      managerInputElements = _useState4[1];

  var _useMyAttachment = (0, _attachment.useMyAttachment)(tmpConfig, 'line'),
      myrequired = _useMyAttachment.myrequired,
      myItemClass = _useMyAttachment.myItemClass,
      myItemStyle = _useMyAttachment.myItemStyle,
      mytitle = _useMyAttachment.mytitle,
      mydesc = _useMyAttachment.mydesc,
      myerror = _useMyAttachment.myerror,
      mytip = _useMyAttachment.mytip,
      myshow = _useMyAttachment.myshow,
      errorType = _useMyAttachment.errorType,
      context = _useMyAttachment.context,
      funKeys = _useMyAttachment.funKeys;

  var allFunkeys = Object.assign({}, funKeys);
  var formLineContext = {
    attr: function attr(ky, val, cb) {
      if (ky) {
        var fn = typeof val !== 'undefined' ? allFunkeys[ky][0] : allFunkeys[ky][1];
        var fun = context[fn];
        return fn && fun && fun(val, cb);
      }
    },
    reset: function reset(param, cb) {
      var _this = this;

      if (_util.lib.isFunction(param)) {
        cb = param;
        param = null;
      }

      if (_util.lib.isArray(param)) {
        param = param.map(function (item) {
          return _this.push(item, null, true);
        });
        managerInputElements([], function () {
          setTimeout(function () {
            return managerInputElements(_toConsumableArray(param), cb);
          }, 50);
        });
      } else {
        managerInputElements(_toConsumableArray(tmpConfig.properties.input), cb);
      }
    },
    push: function push(inputData, cb, inner) {
      if (_util.lib.isPlainObject(inputData)) {
        var inputItemConfig = (0, _dataparser.inputParser)(inputData, groupId);
        dynamicUnion(inputItemConfig, parent);

        if (inner) {
          return inputItemConfig;
        } else {
          inputElements.push(inputItemConfig);
          managerInputElements(_toConsumableArray(inputElements), cb);
        }
      }
    },
    pop: function pop(cb) {
      var index = inputElements.length - 1;
      this.delete(index, cb);
    },
    shift: function shift(cb) {
      this.delete(0, cb);
    },
    unshift: function unshift(inputData, cb) {
      var inputItemConfig = (0, _dataparser.inputParser)(inputData);
      dynamicUnion(inputItemConfig, parent);
      inputElements.unshift(inputItemConfig);
      managerInputElements(_toConsumableArray(inputElements), cb);
    },
    delete: function _delete(cb, callback) {
      var index = this.findIndex(cb);

      if (index > -1 && inputElements[index]) {
        var srouce = inputElements[index];
        var targetId = parent._dynamicUnion[srouce.id];
        var responseIdPrefix = 'response-' + srouce.id; // 删除id相关的联动方法

        _util.lib.forEach(parent._dynamicUnion, function (un, ii, ky) {
          if (ky.indexOf(responseIdPrefix) === 0) {
            parent._dynamicUnion[ky] = null;
          }
        }); // 删除id相关的监听方法


        if (typeof targetId === 'string') {
          parent._dynamicUnion[targetId] = null;
          parent._dynamicUnion[srouce.id] = null;
        }

        inputElements.splice(index, 1);
        managerInputElements(_toConsumableArray(inputElements), callback);
      }
    },
    concat: function concat(param, cb, unshift) {
      var _this2 = this;

      if (param) {
        if (_util.lib.isPlainObject(param)) param = [param];

        if (_util.lib.isArray(param)) {
          param = param.map(function (item) {
            return _this2.push(item, null, true);
          });

          if (unshift) {
            inputElements = param.concat(inputElements);
          } else {
            inputElements = inputElements.concat(param);
          }

          managerInputElements(_toConsumableArray(inputElements), cb);
        }
      }
    },
    append: function append(param, cb) {
      this.concat(param, cb);
    },
    prepend: function prepend(param, cb) {
      this.concat(param, cb, true);
    },
    splice: function splice(cb, pay, callback) {
      if (_util.lib.isFunction(pay)) {
        callback = pay;
        pay = null;
      }

      if (_util.lib.isPlainObject(pay)) {
        var index = this.findIndex(cb);

        if (index > -1) {
          var inputItemConfig = (0, _dataparser.inputParser)(pay);
          dynamicUnion(inputItemConfig, parent);
          inputElements.splice(index, 0, inputItemConfig);
          managerInputElements(_toConsumableArray(inputElements), callback);
        }
      }
    },
    findIndex: function findIndex(query) {
      var index = -1;

      if (query || _util.lib.isNumber(query) && query > -1) {
        if (_util.lib.isNumber(query) && query > -1) {
          index = query;
        } else if (_util.lib.isFunction(query)) {
          inputElements.find(function (item, ii) {
            var res = query(item);
            if (res) index = ii;
          });
        } else if (_util.lib.isPlainObject(query)) {
          index = inputElements.findIndex(function (item) {
            return item.id === query.id;
          });
        }
      }

      return index;
    }
  };
  var mycontext = Object.assign({}, context, formLineContext);
  parent.ctx.group[groupId] = mycontext; // console.log(inputElements);
  // 渲染结构

  inputElements.forEach(function (ipt) {
    myElements.push( /*#__PURE__*/React.createElement(_whatinput.WhatTypeInput, {
      key: ipt.properties.key,
      data: ipt,
      parent: parent
    }));
  });
  var body = /*#__PURE__*/React.createElement("div", {
    className: "line-body"
  }, myElements);

  if (!props.from) {
    body = myElements;
  }

  return myshow ? /*#__PURE__*/React.createElement("div", {
    className: "group-line ".concat(myItemClass || ''),
    style: myItemStyle
  }, myrequired && myrequired.UI ? /*#__PURE__*/React.createElement(myrequired.UI, null) : myrequired, mytitle && mytitle.UI ? /*#__PURE__*/React.createElement(mytitle.UI, null) : mytitle, body, mytip && mytip.UI ? /*#__PURE__*/React.createElement(mytip.UI, null) : mytip
  /* tip */
  , myerror && myerror.UI ? /*#__PURE__*/React.createElement(myerror.UI, null) : myerror
  /* success , warning, error info */
  , mydesc && mydesc.UI ? /*#__PURE__*/React.createElement(mydesc.UI, null) : mydesc) : null;
}

function FormGroup(props) {
  var data = props.data;
  var parent = props.context || props.parent || props.store || (0, _util.createStore)();
  var state = props.state;
  var elementsJSX = [];

  var _useState5 = (0, _util.useState)(data),
      _useState6 = _slicedToArray(_useState5, 2),
      oridata = _useState6[0],
      setOriData = _useState6[1];

  var _useState7 = (0, _util.useState)(oridata),
      _useState8 = _slicedToArray(_useState7, 2),
      $data = _useState8[0],
      setData = _useState8[1];

  var formContext = {
    reset: function reset(param, cb) {
      if (_util.lib.isFunction(param)) {
        cb = param;
        param = null;
      }

      if (_util.lib.isArray(param)) {
        $data = param;
        setData(_toConsumableArray($data), cb);
      } else {
        setData(_toConsumableArray(oridata), cb);
      }
    },
    push: function push(param, cb) {
      if (_util.lib.isPlainObject(param)) {
        $data.push(param);
        setData(_toConsumableArray($data), cb);
      }
    },
    unshift: function unshift(param, cb) {
      if (_util.lib.isPlainObject(param)) {
        $data.unshift(param);
        setData(_toConsumableArray($data), cb);
      }
    },
    concat: function concat(param, cb, unshift) {
      if (param) {
        if (_util.lib.isPlainObject(param)) {
          param = [param];
        }

        if (_util.lib.isArray(param)) {
          if (unshift) {
            $data = param.concat($data);
          } else {
            $data = $data.concat(param);
          }

          setData(_toConsumableArray($data), cb);
        }
      }
    },
    append: function append(param, cb) {
      this.concat(param, cb);
    },
    prepend: function prepend(param, cb) {
      this.concat(param, cb, true);
    },
    pop: function pop(cb) {
      var index = $data.length - 1;
      this.delete(index, cb);
    },
    shift: function shift(cb) {
      this.delete(0, cb);
    },
    splice: function splice(indexer, pay, cb) {
      var index = this.findIndex(indexer);

      if (index > -1 && _util.lib.isPlainObject(pay)) {
        $data.splice(index, 0, pay);
        setData(_toConsumableArray($data), cb);
      }
    },
    delete: function _delete(query) {
      var index = this.findIndex(query);

      if (index > -1) {
        var $formline = $data[index];
        $formline.input.forEach(function (inputItem) {
          var srouce = inputItem;
          var targetId = parent._dynamicUnion[srouce.id];
          var responseIdPrefix = 'response-' + srouce.id; // 删除id相关的联动方法

          _util.lib.forEach(parent._dynamicUnion, function (un, ii, ky) {
            if (ky.indexOf(responseIdPrefix) === 0) {
              parent._dynamicUnion[ky] = null;
            }
          }); // 删除id相关的监听方法


          if (typeof targetId === 'string') {
            parent._dynamicUnion[targetId] = null;
            parent._dynamicUnion[srouce.id] = null;
          }
        });
        $data.splice(index, 1);
        setData(_toConsumableArray($data));
      }
    },
    findIndex: function findIndex(query) {
      var index = -1;

      if (query || _util.lib.isNumber(query) && query > -1) {
        if (_util.lib.isNumber(query) && query > -1) {
          index = query;
        } else if (_util.lib.isFunction(query)) {
          $data.find(function (item, ii) {
            var res = query(item);
            if (res) index = ii;
          });
        } else if (_util.lib.isPlainObject(query)) {
          index = $data.findIndex(function (item) {
            return item.gid === query.gid;
          });
        }
      }

      return index;
    }
  };
  parent.ctx = Object.assign({}, parent.ctx, formContext);
  var mydata = (0, _dataparser.formParser)($data, parent);
  mydata.forEach(function (item, ii) {
    elementsJSX.push( /*#__PURE__*/React.createElement(FormBlock, {
      key: item.key,
      data: item,
      parent: parent,
      from: 'form'
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(props.formClass || 'form')
  }, elementsJSX);
}

var CellGroup = FormGroup;
exports.CellGroup = CellGroup;
var CellBlock = FormBlock;
exports.CellBlock = CellBlock;