/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
/**
 * 常量列表
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2018-2-27
 */
export default {
  /**
   * 添加业务时使用的临时id
   */
  TEMETA_OPTIONS: {
    name: 'options',
    type: 'options',
    label: '参数选项'
  },
  defaultOptionsConfig () {
    return {
      options: []
    }
  },
  addOptionsSwitchItem (opConfig, comp) {
    const label = typeof comp.dep === 'string' ? comp.dep : comp['m-label'] || comp.label
    const name = comp.name
    const items = Array.isArray(opConfig) ? opConfig : opConfig.components[0].items
    if (!items.find(v => v.field === name)) {
      items.push({type: 'switch-box', label, field: name})
    }
  }
}
