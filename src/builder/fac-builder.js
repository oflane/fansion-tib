import fase from 'fansion-base'
import option from './option'
import compBuilders from './comp-builders'
import {isPromise} from 'fansion-base/src/utils/util';

const {sure, isFunction} = fase.util
const gson = fase.rest.gson
const module = fase.mod.module


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
  return cb && isFunction(cb.buildComp) ? cb.buildComp(c, meta) : defaultCompBuild(c, meta)
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

const isDepOptionExist = (options, comp) => {
  const dep = comp.dep
  if (!dep) {
    return true
  }
  if (!options) {
    return false
  }
  return options[comp.name] === true
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
      if (!isDepOptionExist(meta.options, c)) {
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
        if (!isDepOptionExist(meta.options, c)) {
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
    buildFayout(template.layout, layout, components, methods, meta)
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
      Object.assign(methods, eval(template.methods))
    } catch (e) {
      console.warn(e)
    }
  } else if (typeof template.methods === 'object') {
    Object.assign(methods, template.methods)
  }
  if (template.watch) {
    let w = null
    if (isFunction(template.watch)) {
      w = template.watch(meta)
    } else if (typeof template.watch === 'string') {
      try {
        // eslint-disable-next-line no-eval
        w = eval(template.watch)
      } catch (e) {
        console.warn(e)
      }
    } else if (typeof template.watch === 'object') {
      w = template.watch
    }
    if (w) {
      rs.watch = w
    }
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
  if (!comp.name) {
    return
  }
  const cb = compBuilders.getCompBuilder(comp.mode || 'defaultComp', comp.type)
  const {comps, config, defaultModel} = temeta
  if (comp.dep) {
    option.addOptionsSwitchItem(config.options, comp)
  }
  if (comp.nco !== true) {
    comps.push({name: comp.name, type: comp.type, label: comp['m-label'] || comp.label || comp.name})
  }
  if (cb && cb.temeta) {
    const temeta = isFunction(cb.temeta) ? cb.temeta() : cb.temeta
    if (temeta) {
      if (temeta.fata) {
        config[comp.name] = isFunction(temeta.fata) ? temeta.fata() : temeta.fata
      }
      if (temeta.model) {
        defaultModel[comp.name] = isFunction(temeta.model) ? temeta.model() : temeta.model
      } else if (!temeta.fata) {
        config[comp.name] = temeta
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
  const fmeta = fase.plugin.getPlugModule('fansion-meta')
  if (!fmeta) {
    console.log("App has not installed 'fansion-meta' package")
    return
  }
  const layoutType = template.layout && template.comps ? 'layout' : 'fayout'
  let options = template.options || option.defaultOptionsConfig()
  const temeta = {
    name: template.name || '未定义',
    comps: [],
    config: {options},
    defaultModel: {}
  }
  if (layoutType === 'layout') {
    if (Array.isArray(template.comps)) {
      template.comps.forEach(c => addTemetaComp(c, temeta))
    } else {
      Object.entries(template.comps).forEach(([k, c]) => sure(c.name = k) && addTemetaComp(c, temeta))
    }
  } else {
    addFayoutTemetaComp(template.layout, temeta)
  }
  if (Array.isArray(options)) {
    options = fmeta.fata.buildFormFata(options)
    temeta.config.options = options
  }
  if (options.components[0].items.length > 0) {
    temeta.comps.splice(0, 0, option.TEMETA_OPTIONS)
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
  if (isPromise(template)) {
    return template.then(r => buildTemplate(module(r)))
  }
  if (typeof template === 'string') {
    if (!template.startsWith('{')) {
      return () => gson(template).then(buildTemplate)
    }
    // eslint-disable-next-line no-eval
    template = eval(template)
  }
  return meta => parseTemplate(template, meta)
}

/**
 * 生成fac模板配置元数据
 * @param template 模板内容
 * @returns {*}
 */
const buildTemeta = (template) => {
  isFunction(template) && (template = template())
  if (isPromise(template)) {
    return template.then(r => buildTemeta(module(r)))
  }
  if (typeof template === 'string') {
    if (!template.startsWith('{')) {
      return () => gson(template).then((res) => {
        return buildTemeta(res)
      })
    }
    // eslint-disable-next-line no-eval
    template = eval(template)
  }
  return parseTemeta(template)
}
export default {
  buildTemplate,
  buildTemeta
}
