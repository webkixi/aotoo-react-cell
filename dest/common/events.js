"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supplementEvents = supplementEvents;

var _util = require("./util");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function emitUnionResponse(response, evtkey, ctx, parent) {
  response.forEach(function (linkitem) {
    var _linkitem = _slicedToArray(linkitem, 3),
        ekey = _linkitem[0],
        linkfun = _linkitem[1],
        srcId = _linkitem[2];

    var sourceBehaviorContext = parent.ctx.elements[srcId];
    var value = ctx.getValue();

    if (ekey) {
      if (ekey === evtkey) linkfun.call(sourceBehaviorContext, {
        value: value
      }, ctx);
    } else {
      linkfun.call(sourceBehaviorContext, {
        value: value
      }, ctx);
    }
  });
}

function getDynamicUnion(prefix, parent) {
  var target = [];

  _util.lib.forEach(parent._dynamicUnion, function (un, ii, ky) {
    if (ky.indexOf(prefix) === 0) {
      target.push(un);
    }
  });

  return target;
}

function supplementEvents(inputConfig, mycontext, parent) {
  var attributes = inputConfig.attributes || {};
  var properties = inputConfig.properties || {};
  var events = inputConfig.events || {};
  var unionResponse = properties.unionResponse || []; // let dynamicUnion = parent._dynamicUnion[('response-' + inputConfig.id)]

  var dynamicUnion = getDynamicUnion('response-' + inputConfig.id, parent);

  if (dynamicUnion && _util.lib.isArray(dynamicUnion)) {
    unionResponse = unionResponse.concat(dynamicUnion);
  }

  function innerOnChange(e) {
    mycontext.setValue(e.target.value);
  }

  if (_util.lib.isEmpty(events)) {
    if (unionResponse.length) {
      unionResponse = unionResponse.map(function (un) {
        un[0] = null;
        return un;
      });
      events = {
        onChange: innerOnChange
      };
    }
  } // 有value时必须绑onChange事件


  if (attributes.hasOwnProperty('value')) {
    var hasOnChangeEvent = true;

    if (!events.onChange) {
      hasOnChangeEvent = false;
    }

    if (!hasOnChangeEvent) {
      events = {
        onChange: innerOnChange
      };
    }
  }

  if (!_util.lib.isEmpty(events)) {
    _util.lib.forEach(events, function (fun, ii, evtkey) {
      var funEntity = function funEntity(fn, param) {
        return function (e) {
          if (_util.lib.isFunction(e)) {
            var oldfn = fn;
            var newfn = e;
            return [oldfn, function (evt) {
              newfn(evt, param, mycontext);
              emitUnionResponse(unionResponse, evtkey, mycontext, parent);
            }];
          }

          e.persist();

          if (_util.lib.isString(fn)) {
            if (_util.lib.isFunction(parent[fn])) {
              parent[fn](e, param, mycontext);
            }
          }

          if (_util.lib.isFunction(fn)) {
            fn(e, param, mycontext);
          } // 设计联动方法的参数


          emitUnionResponse(unionResponse, evtkey, mycontext, parent);
        };
      };

      if (_util.lib.isString(fun)) {
        var funName = _util.lib.uniqueId("".concat(fun, "-").concat(properties.id || properties.name, "-"));

        var obj = _util.lib.urlTOquery(fun);

        var query = obj.query;
        funName = obj.url;
        attributes[evtkey] = funEntity(funName, query
        /* ,param, inst */
        );
      }

      if (_util.lib.isFunction(fun)) {
        attributes[evtkey] = funEntity(fun, null
        /* ,param, inst */
        );
      }
    });
  }

  return attributes;
}