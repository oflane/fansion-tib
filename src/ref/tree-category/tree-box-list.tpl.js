/* eslint-disable no-eval,no-new-func */
/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import fase from 'fansion-base'

const DataLoader = fase.DataLoader
/**
 * 左树右表格引用配置
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  name: '左树矩阵',
  init: {
    options: {
      refProp: 'id'
    }
  },
  options: [
    {
      type: 'input',
      label: '查询URL: ',
      field: 'listUrl',
      placeholder: '格子列表数据记载的url',
      validation: [
        {required: true, message: '列表查询URL不能为空', trigger: 'blur'}
      ]
    },
    {
      type: 'input',
      label: '左树条件参数: ',
      field: 'treeParam',
      placeholder: '左树选中节点作为列表加载的条件参数名',
      validation: [
        {required: true, message: '左树条件参数不能为空', trigger: 'blur'}
      ]
    },
    {
      type: 'input',
      label: '引用字段名: ',
      field: 'refProp',
      placeholder: '左树选中节点作为列表加载的条件参数名',
      validation: [
        {required: true, message: '左树条件参数不能为空', trigger: 'blur'}
      ]
    }
  ],
  layout: {
    class: 'content-relative',
    children: [
      {
        class: 'left-panel',
        children: [
          {
            class: 'dlg-left-search',
            comp: {type: 'search', name: 'searchTree', slot: 'left-search', dep: '左树查找', nco: true, '@search': 'searchTree'}
          },
          {
            class: 'padding-10',
            comp: {type: 'simple-tree', name: 'leftTree', label: '左树', slot: 'left-content', '@current-change': 'currentNodeChange()'}
          }
        ]
      },
      {
        class: 'right-content padding-15',
        children: [
          {
            class: 'min-height-400',
            comp: {type: 'box-list', name: 'boxList', 'm-label': '块列表', ':model': 'model'}
          },
          {
            class: 'clearfix',
            comp: {type: 'pagination', name: 'pagination', ':loader': 'loader', dep: '是否分页', nco: true}
          }
        ]
      }
    ]
  },
  buildData (meta, data) {
    return function() {
      const vm = this
      const options = meta.options || {}
      const model = options.pagination ? {content: [], totalElements: 0} : []
      const loader = new DataLoader(options.listUrl, vm.page || this, 'model')
      return data ? {
        loader,
        model,
        ...data
      } : {
        loader,
        model
      }
    }
  },
  methods (meta) {
    /**
     * 元数据
     */
    const {pagination, treeParam, searchTree, refProp = 'id'} = meta.options
    return {
      /**
       * 初始化界面
       */
      initPage () {
        const vm = this
        vm.$refs.leftTree.refresh()
      },
      /**
       * 当前节点变化
       */
      currentNodeChange () {
        this.refresh()
      },
      /**
       * 搜索左树
       * @param value 检索值
       */
      searchTree (value) {
        const vm = this
        vm.$refs.leftTree.filter(value)
      },
      /**
       * 重置搜索
       */
      reset () {
        searchTree && this.$refs.searchTree.reset()
        this.$parent.reset && this.$parent.reset()
        this.$refs.boxList.reset()
      },
      /**
       * 获取当前数据
       * @returns {{label: *, value: *}}
       */
      getData () {
        const boxList = this.$refs.boxList
        const item = boxList.getCurrentItem()
        const r = {value: item[refProp], label: item[boxList.label]}
        this.reset()
        return r
      },
      /**
       * 搜索列表
       * @param keyword 关键字
       */
      search (keyword) {
        const vm = this
        if (!keyword) {
          const container = vm.$parent.$parent
          keyword = container.getKeyword && container.getKeyword()
        }
        vm.loader.setParameter('keyword', keyword)
      },
      /**
       * 页面刷新操作
       */
      refresh () {
        const vm = this
        const node = vm.$refs.leftTree.getCurrentNode()
        if (node) {
          vm.loader.setParameter(treeParam, node.id)
        } else {
          vm.model = pagination ? {content: [], totalElements: 0} : []
        }
      }
    }
  }
}