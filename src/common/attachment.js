/**
 * 构建表单附加属性状态机
 * 如 title, desc, required, itemClass, itemStyle等
 */
import { useState, lib } from "./util";

// 生成 title, desc, error等附加部分
export function createAttachment(content, cls, attrs={}){
  if (lib.isString(content)) {
    return <div className={cls}>{content}</div>
  }

  if (React.isValidElement(content)) {
    return React.cloneElement(content, {className: cls})
  }

  if (typeof ui_item!=='undefined' && lib.isPlainObject(content)) {
    let itemClass = content.itemClass ? content.itemClass + ` ${cls}` : cls
    content.itemClass = itemClass
    return ui_item(content)
  }
}

export let inputPropKey = ['title', 'desc', 'error', 'show', 'itemClass', 'itemStyle']
// let errorType = false
// function setErrorType(val){
//   errorType = val
// }

export function useMyAttachment(itemConfig, prefix='item') {
  let funKeys = {}
  let attributes = itemConfig.attributes||{}
  let properties = itemConfig.properties
  let myrequired = properties.required

  let inputPropBehavior = {}
  let timmer = null

  let [v, setV] = useState(properties)
  let [errorType, setErrorType] = useState('')

  inputPropKey.forEach(ky=>{
    let val = properties[ky]
    if (!lib.isFunction(val)) {
      let n = ['set '+ky, 'get '+ky, ky]
      n = n.map(k=>lib.camelCase(k))
      funKeys[ky] = n
      // v = properties
  
      // setValue setClass setReadonly
      inputPropBehavior[n[0]] = function(param, cb){
        v[ky] = ky === 'show' ? (param === undefined ? true : param) : param
        if (timmer) clearTimeout(timmer)
        // v = properties
        timmer = setTimeout(() => {
          setV({...v}, cb)
          timmer = null
        }, 17);
      }
  
      inputPropBehavior[n[1]] = function(){ 
        return v[ky] 
      }
    }
  })

  let context = {
    keys: [
      ['setTitle', 'getTitle', 'title'],
      ['setDesc', 'getDesc', 'desc'],
      ['error', 'getError', 'error'],
      ['show', 'getShow', 'show'],
    ],
    setItemClass(cls, cb){
      inputPropBehavior.setItemClass(cls, cb)
    },
    setItemStyle(styl, cb){
      inputPropBehavior.setItemStyle(styl, cb)
    },
    setTitle(param, cb){
      inputPropBehavior.setTitle(param, cb)
    },
    setDesc(param, cb){
      inputPropBehavior.setDesc(param, cb)
    },
    error(param){
      if (param) {
        inputPropBehavior.setError(param||properties.error)
        setErrorType('error')
      } else {
        this.removeError()
      }
    },
    removeError(){
      inputPropBehavior.setError(properties.error)
      setErrorType('')
    },
    warn(param){
      if (param) {
        inputPropBehavior.setError(param)
        setErrorType('warn')
      } else {
        this.removeError()
      }
    },
    info(param){
      if (param) {
        inputPropBehavior.setError(param)
        setErrorType('info')
      } else {
        this.removeError()
      }
    },
    show(cb){
      inputPropBehavior.setShow(true, cb)
    },
    hide(cb){
      inputPropBehavior.setShow(false, cb)
    }
  }

  let dftcls = ['title', 'desc', 'error', 'required']
  if (prefix) {
    dftcls = dftcls.map(item => (prefix + '-' + item))
  }

  let myshow = inputPropBehavior.getShow()
  let myItemClass = inputPropBehavior.getItemClass()
  let myItemStyle = inputPropBehavior.getItemStyle()
  let mytitle = createAttachment(inputPropBehavior.getTitle(), dftcls[0], attributes)
  let mydesc = createAttachment(inputPropBehavior.getDesc(), dftcls[1], attributes)
  let myerror = createAttachment(inputPropBehavior.getError(), dftcls[2] + ' ' + errorType , attributes)
  myrequired = myrequired ? myrequired === true ? <div className={dftcls[3]} /> : createAttachment(myrequired, dftcls[3], attributes) : false

  return {
    funKeys,
    context, 
    // myItemClass: properties.itemClass,
    // myItemStyle: properties.itemStyle,
    myItemClass: myItemClass,
    myItemStyle: myItemStyle,
    
    myrequired,
    mytitle,
    mydesc,
    myerror,
    myshow,
    errorType
  }
}