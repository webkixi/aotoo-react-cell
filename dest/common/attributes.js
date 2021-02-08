"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAttrState = createAttrState;

var _util = require("./util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var inputBehaviorKey = ['className', 'value', 'values', 'disabled', 'readOnly', 'style', 'checked'];

function createAttrState(id, attr, setAttribute) {
  var funKeys = {};
  var inputAttrBehavior = {
    id: id
  };
  var timmer = null;
  inputBehaviorKey.forEach(function (ky) {
    var val = attr[ky];

    if (attr.hasOwnProperty(ky) && !_util.lib.isFunction(val)) {
      if (ky === 'className') ky = 'class';
      var n = ['set ' + ky, 'get ' + ky, ky];
      n = n.map(function (k) {
        return _util.lib.camelCase(k);
      });
      funKeys[ky] = n;

      inputAttrBehavior[n[0]] = function (param, cb) {
        if (ky === 'class') {
          attr['className'] = param;
        } else {
          attr[ky] = param;
        }

        if (timmer) clearTimeout(timmer);
        timmer = setTimeout(function () {
          setAttribute(_objectSpread({}, attr), cb);
        }, 17);
      };

      inputAttrBehavior[n[1]] = function () {
        if (ky === 'class') {
          return attr['className'];
        }

        return attr[ky];
      };
    }
  });
  var myattrs = attr.attributes || {};
  var attrTimmer = null;
  var attributesContext = {
    id: id
  };
  var myattrsKeys = Object.keys(myattrs);
  myattrsKeys.forEach(function (ky) {
    var val = myattrs[ky];

    if (ky.indexOf('on') === -1 && !_util.lib.isFunction(val)) {
      var n = ['set ' + ky, 'get ' + ky, ky];
      n = n.map(function (k) {
        return _util.lib.camelCase(k);
      });
      funKeys[ky] = n; // setValue setClass setReadonly

      attributesContext[n[0]] = function (param, cb) {
        myattrs[ky] = ky === 'show' ? param || true : param;
        if (attrTimmer) clearTimeout(attrTimmer);
        attrTimmer = setTimeout(function () {
          setAttribute(_objectSpread({}, myattrs), cb);
          attrTimmer = null;
        }, 17);
      };

      attributesContext[n[1]] = function () {
        return attr.attributes[ky];
      };
    }
  });
  return [inputAttrBehavior, attributesContext, funKeys];
} // export function createAttrState(inputConfig){
//   let id = inputConfig.id
//   let funKeys = {}
//   let inputAttrBehavior = {id}
//   let attributes = inputConfig.attributes||{}
//   let [v, setV] = useState(attributes)
//   v = attributes
//   let timmer = null
//   inputBehaviorKey.forEach(ky=>{
//     if (ky === 'className') ky = 'class'
//     let val = attributes[ky]
//     if (attributes.hasOwnProperty(ky) && !lib.isFunction(val)) {
//       let n = ['set '+ky, 'get '+ky, ky]
//       n = n.map(k=>lib.camelCase(k))
//       funKeys[ky] = n
//       inputAttrBehavior[n[0]] = function(param, cb){
//         if (ky === 'class') {
//           attributes['className'] = param  
//         } else {
//           attributes[ky] = param
//         }
//         if (timmer) clearTimeout(timmer)
//         timmer = setTimeout(() => {
//           v = attributes
//           setV({...attributes}, cb)
//         }, 17);
//       }
//       inputAttrBehavior[n[1]] = function(){ 
//         if (ky === 'class') {
//           return v['className']   
//         }
//         return v[ky] 
//       }
//     }
//   })
//   // 设置子属性监听方法
//   // 用于非input组件
//   let myattrs = attributes.attributes||{}
//   let attrTimmer = null
//   let attributesContext = {id}
//   let myattrsKeys = Object.keys(myattrs)
//   myattrsKeys.forEach(ky=>{
//     let val = myattrs[ky]
//     if (ky.indexOf('on') === -1 && !lib.isFunction(val)) {
//       let n = ['set '+ky, 'get '+ky, ky]
//       n = n.map(k=>lib.camelCase(k))
//       funKeys[ky] = n
//       // setValue setClass setReadonly
//       attributesContext[n[0]] = function(param, cb){
//         myattrs[ky] = ky === 'show' ? (param||true) : param
//         if (attrTimmer) clearTimeout(attrTimmer)
//         attrTimmer = setTimeout(() => {
//           v.attributes = myattrs
//           setV({...v}, cb)
//           attrTimmer = null
//         }, 17);
//       }
//       attributesContext[n[1]] = function(){ 
//         return v.attributes[ky] 
//       }
//     }
//   })
//   // let timmer = null
//   // inputBehaviorKey.forEach(ky=>{
//   //   if (ky === 'className') ky = 'class'
//   //   if (attributes.hasOwnProperty(ky)) {
//   //     let n = ['set '+ky, 'get '+ky, ky]
//   //     n = n.map(k=>lib.camelCase(k))
//   //     let [v, setV] = useState(attributes)
//   //     v = attributes
//   //     // setValue setClass setReadonly
//   //     inputAttrBehavior[n[0]] = function(param){
//   //       if (ky === 'class') {
//   //         attributes['className'] = param  
//   //       } else {
//   //         attributes[ky] = param
//   //       }
//   //       if (timmer) clearTimeout(timmer)
//   //       timmer = setTimeout(() => {
//   //         v = attributes
//   //         setV({...attributes})
//   //       }, 17);
//   //     }
//   //     inputAttrBehavior[n[1]] = function(){ 
//   //       if (ky === 'class') {
//   //         return v['className']   
//   //       }
//   //       return v[ky] 
//   //     }
//   //   }
//   // })
//   // return inputAttrBehavior
//   // inputAttrBehavior.funKeys = funKeys
//   // inputAttrBehavior.attrs = attributesContext
//   return [inputAttrBehavior, attributesContext, funKeys]
// }