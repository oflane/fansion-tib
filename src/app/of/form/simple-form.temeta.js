/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

/**
 * 表单模板描述
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  name: 'OF实体简单表单',
  comps: [
    {
      name: 'options',
      type: 'options',
      label: '参数选项'
    },
    {
      name: 'facForm',
      type: 'fac-form',
      label: '表单定义'
    }
  ],
  defaultModel: { options: {} },
  config: {
    options: {
      components: [
        {
          type: 'fac-form',
          cols: 1,
          ref: 'subPage',
          ':model': 'model',
          items: [
            {
              type: 'input',
              label: 'OF实体: ',
              field: 'ofmodel'
            }
          ]
        }
      ],
      methods: {
        validate (cb) {
          const sub = this.$refs.subPage
          if (sub.validate) {
            sub.validate(cb)
          } else {
            cb.call(this, true)
          }
        }
      }
    }
  }
}
