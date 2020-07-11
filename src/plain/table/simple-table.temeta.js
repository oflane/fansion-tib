/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

/**
 * 列表模板描述
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  name: '简单列表',
  comps: [
    {
      name: 'options',
      type: 'options',
      label: '参数选项'
    },
    {
      name: 'search',
      type: 'search',
      label: '简单查询'
    },
    {
      name: 'xquery',
      type: 'xquery',
      label: '高级查询'
    },
    {
      name: 'simpleTable',
      type: 'simple-table',
      label: '简单列表'
    }
  ],
  defaultModel: {options: {urls: {}}},
  config: {
    options: {
      components: [
        {
          type: 'fac-form',
          cols: 1,
          ':model': 'model.urls',
          items: [
            {
              type: 'input',
              label: '查询URL: ',
              field: 'query',
              validation: [
                {required: true, message: '查询地址不能为空', trigger: 'blur'}
              ]
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
              label: '删除URL: ',
              field: 'delete',
              validation: [
                {required: true, message: '删除地址不能为空', trigger: 'blur'}
              ]
            }
          ]
        }
      ]
    }
  }
}
