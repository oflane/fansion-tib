/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

/**
 * 列表模板描述
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  name: '简单表单',
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
  defaultModel: {options: {urls: {}}},
  config: {
    options: {
      components: [
        {
          type: 'fac-form',
          cols: 1,
          ref: 'subPage',
          ':model': 'model.urls',
          items: [
            {
              type: 'input',
              label: '新增URL: ',
              field: 'add'
            },
            {
              type: 'input',
              label: '编辑URL: ',
              field: 'edit',
              validation: [
                {required: true, message: '编辑地址不能为空', trigger: 'blur'}
              ]
            },
            {
              type: 'input',
              label: '保存URL: ',
              field: 'save',
              validation: [
                {required: true, message: '保存地址不能为空', trigger: 'blur'}
              ]
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
