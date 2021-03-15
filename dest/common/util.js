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

var createStore = function createFormStore() {
  var store = {
    uniqueId: new Date().getTime(),
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
      privateStore[this['uniqueId']].ctx = this.ctx;
      privateStore[this['uniqueId']].getById = this.getById;
      privateStore[this['uniqueId']]._dynamicUnion = this._dynamicUnion;
    }
  };
  privateStore[store['uniqueId']] = store;
  return store;
};

exports.createStore = createStore;