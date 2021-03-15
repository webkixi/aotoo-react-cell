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
export const createStore = function createFormStore(){
  const store = {
    uniqueId: (new Date().getTime()),
    
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
      privateStore[this['uniqueId']].ctx = this.ctx
      privateStore[this['uniqueId']].getById = this.getById
      privateStore[this['uniqueId']]._dynamicUnion = this._dynamicUnion
    }
  }
  privateStore[store['uniqueId']] = store
  return store
}


export {lib} from '@aotoo/aotoo'

