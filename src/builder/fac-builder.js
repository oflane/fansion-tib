import fase from 'fansion-base'
import fui from 'fansion-ui'
import compBuilders from './comp-builders'

const {sure, isFunction} = fase.util
const gson = fase.rest.gson
const TEMETA_OPTIONS = fui.constant.TEMETA_OPTIONS

let slotId = 0
/**
 * 默认的组件构建方法
 * @param c
 * @param meta
 * @returns {{ref: *, pos: *, type: *}|{pos: *, type: *}}
 */
const defaultCompBuild = (c, meta) => {
  const {name, type, slot} = c
  if (!type) {
    return
  }
  return name ? Object.assign({type, ref: name, pos: slot}, c, (meta[name] || {})) : {type, pos: slot}
}
/**
 * 根据配置构建组建
 * @param c 模板中的组建定义一般为json
 * {
 *    name：组件名称，用于对应配置，以及作为ref属性,
 *    type: 组建类型,
 *    mode: 一个组建提供多种配置模式，如果不指定为default
 *    slot：在布局中的位置信息
 *  }
 * @param meta 模板配置数据
 * @returns {*|{ref: *, pos: *, type: *}|{pos: *, type: *}}
 */
const buildComponent = (c, meta) => {
  const cb = compBuilders.getCompBuilder(c.mode || 'defaultComp', c.type)
  return cb && isFunction(cb.build) ? cb.buildComp(c, meta) : defaultCompBuild(c, meta)
}

/**
 * 生成组件相应的方法
 * @param c 组建配置
 * @param meta 元数据对象
 * @returns {*|null}
 */
const buildMethods = (c, meta) => {
  const cb = compBuilders.getCompBuilder(c.mode || 'defaultComp', c.type)
  return cb ? isFunction(cb.methods) ? cb.methods(meta, c) : cb.methods : null
}
/**
 * 递归构建fayout布局
 * @param layout 布局原始配置
 * @param fayout 布局结果对象
 * @param components 组件列表
 * @param methods 方法列表
 * @param meta 元数据对象
 */
const buildFayout = (layout, fayout, components, methods, meta) => {
  if (Array.isArray(layout)) {
    layout.forEach((c) => {
      if (c.dep && (!meta.options || meta.options[dep] !== true )) {
        return
      }
      const f = Array.isArray(c) ? [] : {}
      fayout.push(f)
      buildFayout(c, f, components, methods, meta)
    })
  } else if (layout.type) {
    layout.slot || sure(layout.slot = 'slot' + slotId++)
    fayout.slot = layout.slot
    components.push(buildComponent(layout, meta))
    Object.assign(methods, buildMethods(layout, meta))
  } else {
    Object.entries(layout).forEach(([k, v]) => {
      if (!v) {
        return
      }
      if (k === 'comp') {
        const c = typeof v === 'string' ? {type: v, slot: 'slot' + slotId++} : (v.slot || sure(v.slot = 'slot' + slotId++)) && v
        if (c.dep && (!meta.options || meta.options[dep] !== true )) {
          return
        }
        fayout.slot = c.slot
        components.push(buildComponent(c, meta))
        Object.assign(methods, buildMethods(c, meta))
      } else if (Array.isArray(v)) {
        fayout[k] = v.map(c => {
          if (typeof c === 'string') {
            return c
          }
          const f = Array.isArray(c) ? [] : {}
          buildFayout(c, f, components, methods, meta)
          return f
        })
      } else if (typeof v === 'object') {
        const f = {}
        fayout[k] = f
        buildFayout(v, f, components, methods, meta)
      } else {
        fayout[k] = v
      }
    })
  }
}
/**
 * 模板构建
 * @param template 模板相关配置
 * @param meta 元数据对象
 * @returns {{layout: *}}
 */
const parseTemplate = (template, meta) => {
  const layoutType = template.layout && template.comps ? 'layout' : 'fayout'
  const methods = {}
  const rs = {
    methods
  }
  if (layoutType === 'layout') {
    rs.layout = template.layout
    const options = meta.options || {}
    if (Array.isArray(template.comps)) {
      rs.components = template.comps.map(c => (!c.dep || options[c.dep] === true) && sure(Object.assign(methods, buildMethods(c, meta[c.name]))) && buildComponent(c, meta[c.name]))
    } else {
      rs.components = Object.entries(template.comps).map(([k, c]) => (!c.dep || options[c.dep] === true) && sure(c.name = k) && sure(Object.assign(methods, buildMethods(c, meta[c.name]))) && buildComponent(c, meta[c.name]))
    }
  } else {
    const layout = {}
    const components = []
    rs.layout = layout
    rs.components = components
    buildFayout(template.layout, layout, components, meta)
  }
  if (isFunction(template.buildData)) {
    rs.data = template.buildData(meta)
  } else if (template.data) {
    let d = template.data
    if (typeof d === 'string') {
      try {
        // eslint-disable-next-line no-eval
        d = eval(d)
      } catch (e) {
        console.warn(e)
      }
    }
    if (isFunction(d)) {
      rs.data = d
    }
  }
  if (isFunction(template.methods)) {
    Object.assign(methods, template.methods(meta))
  } else if (typeof template.methods === 'string') {
    try {
      // eslint-disable-next-line no-eval
      eval(template.methods)
      Object.assign(methods, (meta))
    } catch (e) {
      console.warn(e)
    }
  } else if (typeof template.methods === 'object') {
    Object.assign(methods, template.methods)
  }
  return rs
}
/**
 * 添加组件到temata的组件列表和配置元数据中
 * @param comp 组件配置
 * @param comps 组件列表
 * @param fatas 配置元数据列表
 */
const addTemetaComp = (comp, temeta) => {
  if (!comp.name){
    return
  }
  const cb = compBuilders.getCompBuilder(comp.mode || 'defaultComp', comp.type)
  const {comps, fatas, defaultModel} = temeta
  if (cb && cb.temeta) {
    const temeta = isFunction(cb.temeta) ? cb.temeta() : cb.temeta
    comps.push(comp)
    if (temeta) {
      if (temeta.fata) {
        fatas[comp.name] = isFunction(temeta.fata) ? temeta.fata() : temeta.fata
      }
      if (temeta.model) {
        defaultModel[comp.name] = isFunction(temeta.model) ? temeta.model() : temeta.model
      } else if (!temeta.fata) {
        fatas[comp.name] = temeta
      }
    }
  }
}
/**
 * 递归构建fayout布局
 * @param layout 布局原始配置
 * @param temeta 组件配置界面元数据
 */
const addFayoutTemetaComp = (layout, temeta) => {
  if (Array.isArray(layout)) {
    layout.forEach((c) => {
      typeof c === 'object' && addFayoutTemetaComp(c, temeta)
    })
  } else if (layout.type) {
    addTemetaComp(layout, temeta)
  } else {
    Object.entries(layout).forEach(([k, v]) => {
      if (!v) {
        return
      }
      if (k === 'comp') {
        typeof v === 'object' && addTemetaComp(v, temeta)
      } else if (typeof v === 'object') {
        addFayoutTemetaComp(v, temeta)
      }
    })
  }
}
/**
 * 解析生成模板元数据
 * @param template 模板配置
 * @returns {{comps: (*[]), name: (*|string), config: {options: *}}}
 */
const parseTemeta = (template) => {
  const layoutType = template.layout && template.comps ? 'layout' : 'fayout'
  const options = template.options
  const temeta = {
    name: template.name || '未定义',
    comps: options ? [TEMETA_OPTIONS] : [],
    config: options ? {options} : {},
    defaultModel: {}
  }
  if (layoutType === 'layout') {
    if (Array.isArray(template.comps)) {
      template.comps.forEach(c => addTemetaComp(c, temeta))
    } else {
      Object.entries(template.comps).forEach(([k, c]) => sure(c.name = k) && addTemetaComp(c, temeta))
    }
  } else {
    addFayoutTemetaComp(template.layout, temeta.comps, temeta.config)
  }
  template.init && (temeta.defaultModel = isFunction(template.init) ? template.init() : template.init)
  return temeta
}
/**
 * 生成fac模板对象
 * @param template 模板内容
 * @returns {*}
 */
const buildTemplate = (template) => {
  isFunction(template) && (template = template())
  if (typeof template === 'string') {
    if (!template.startsWith('{')) {
      return () => gson(template).then((res) => {
        return buildTemplate(res)
      })
    }
    // eslint-disable-next-line no-eval
    template = eval(template)
  }
  return (meta) => {
    parseTemplate(template, meta)
  }
}

/**
 * 生成fac模板配置元数据
 * @param template 模板内容
 * @returns {*}
 */
const buildTemeta = (template) => {
  isFunction(template) && (template = template())
  if (typeof template === 'string') {
    if (!template.startsWith('{')) {
      return () => gson(template).then((res) => {
        return parseTemeta(res)
      })
    }
    // eslint-disable-next-line no-eval
    template = eval(template)
  }
  return parseTemeta(template)
}
export {
  buildTemplate,
  buildTemeta
}
