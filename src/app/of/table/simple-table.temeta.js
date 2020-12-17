/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

/**
 * 列表模板描述
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  name: 'OF实体简单列表',
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
  defaultModel: {options: {}},
  config: {
    options: {
      components: [
        {
          type: 'fac-form',
          cols: 1,
          ':model': 'model',
          items: [
            {
              type: 'input',
              label: 'OF实体: ',
              field: 'ofmodel'
            },
            {
              type: 'input',
              label: '详情页: ',
              field: 'detailUrl'
            }
          ]
        }
      ]
    }
  }
}
