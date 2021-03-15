export function useState (od) {
  const cbRef = React.useRef();
  const [data, setData] = React.useState(od);

  if (typeof od !== 'function') {
    React.useEffect(() => {
      setData(od)
    }, [od]);
  }

  React.useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [data, function (d, callback) {
    cbRef.current = callback;
    setData(d);
  }];
}

let privateStore = {}
let valueStack = []
export const createStore = function createFormStore(){
  const store = {
    _storeUniqueId: (new Date().getTime()),
    
    ctx: {
      elements: {},
      group: {},
    },
    
    getById(id){
      try {
        const cell = this.ctx.elements[id] || this.ctx.group[id]
        if (!cell) throw new Error('没有相关该元素')
        return cell
      } catch (error) {
        console.warn(error)
      }
    },

    _dynamicUnion: {},

    // cell被深度clone时，由cell内部重新绑定
    remount(){
      privateStore[this['_storeUniqueId']].ctx = this.ctx
      privateStore[this['_storeUniqueId']]._dynamicUnion = this._dynamicUnion
    },

    storeHelper: {
      value: (id, val)=>{
        let result = {}
        Object.keys(store.ctx.elements).forEach(inputId=>{
          const input = store.getById(inputId)
          result[inputId] = input.attr('value')
        })
        if (!id && !val) {
          return result
        }
        if (id && !val) {
          return result[id]
        }
        if (id && val) {
          const input = store.getById(id)
          input.attr('value', val)
        }
      },

      save: ()=>{
        const allValue = store.storeHelper.value()
        valueStack.push(allValue)
      },

      restore: ()=>{
        const lastAllValue = valueStack.pop()
        if (lastAllValue) {
          Object.keys(lastAllValue).forEach(inputId=>{
            const input = store.getById(inputId)
            input.attr('value', lastAllValue[inputId])
          })
        }
      }
    }
  }
  privateStore[store['_storeUniqueId']] = store
  return store
}


export {lib} from '@aotoo/aotoo'

