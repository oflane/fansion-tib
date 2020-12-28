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
      options: {
        components: [{
          type: 'fac-form',
          cols: 1,
          ':model': 'model',
          items: []
        }]
      }
    }
  },
  addOptionsSwitchItem (opConfig, {name, label}) {
    if (!opConfig.components[0].items.find(v => v.field === name)) {
      opConfig.components[0].items.push({type: 'switch-box', label, field: name})
    }
  }
}
