"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = useState;
Object.defineProperty(exports, "lib", {
  enumerable: true,
  get: function get() {
    return _aotoo.lib;
  }
});
exports.createStore = void 0;

var _aotoo = require("@aotoo/aotoo");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useState(od) {
  var cbRef = React.useRef();

  var _React$useState = React.useState(od),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      data = _React$useState2[0],
      setData = _React$useState2[1];

  if (typeof od !== 'function') {
    React.useEffect(function () {
      setData(od);
    }, [od]);
  }

  React.useEffect(function () {
    cbRef.current && cbRef.current(data);
  }, [data]);
  return [data, function (d, callback) {
    cbRef.current = callback;
    setData(d);
  }];
}

var privateStore = {};
var valueStack = [];

var createStore = function createFormStore() {
  var store = {
    _storeUniqueId: new Date().getTime(),
    ctx: {
      elements: {},
      group: {}
    },
    getById: function getById(id) {
      try {
        var cell = this.ctx.elements[id] || this.ctx.group[id];
        if (!cell) throw new Error('没有相关该元素');
        return cell;
      } catch (error) {
        console.warn(error);
      }
    },
    _dynamicUnion: {},
    // cell被深度clone时，由cell内部重新绑定
    remount: function remount() {
      privateStore[this['_storeUniqueId']].ctx = this.ctx;
      privateStore[this['_storeUniqueId']]._dynamicUnion = this._dynamicUnion;
    },
    storeHelper: {
      value: function value(id, val) {
        var result = {};
        Object.keys(store.ctx.elements).forEach(function (inputId) {
          var input = store.getById(inputId);
          result[inputId] = input.attr('value');
        });

        if (!id && !val) {
          return result;
        }

        if (id && !val) {
          return result[id];
        }

        if (id && val) {
          var input = store.getById(id);
          input.attr('value', val);
        }
      },
      save: function save() {
        var allValue = store.storeHelper.value();
        valueStack.push(allValue);
      },
      restore: function restore(id) {
        if (id) id = [].concat(id);
        var lastAllValue = valueStack.pop();

        if (lastAllValue) {
          Object.keys(lastAllValue).forEach(function (inputId) {
            var restoreInputValue = true;

            if (id) {
              restoreInputValue = id.indexOf(inputId) > -1 ? true : false;
            }

            if (restoreInputValue) {
              var input = store.getById(inputId);
              input.attr('value', lastAllValue[inputId]);
            }
          });
        }
      }
    }
  };
  privateStore[store['_storeUniqueId']] = store;
  return store;
};

exports.createStore = createStore;