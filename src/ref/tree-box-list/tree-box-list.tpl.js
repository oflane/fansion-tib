/* eslint-disable no-eval,no-new-func */
/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import fase from 'fansion-base'

const DataLoader = fase.DataLoader
const ALL_DATA = fase.constant.ALL_DATA
/**
 * 左树右表格参照配置
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  options: {
    components: [
      {
        type: 'fac-form',
        cols: 1,
        ':model': 'model',
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
  },
  layout: {
    class: 'reference-min-height',
    children: [
      {
        class: 'left-tree',
        children: [
          {
            class: 'dlg-left-search',
            comp: {type: 'search', name: 'searchTree', slot: 'left-search', dep: 'searchTree'}
          },
          {
            class: 'dlg-left-content',
            comp: {type: 'simple-tree', name: 'leftTree', slot: 'left-content', '@current-change': 'page.currentNodeChange()'}
          }
        ]
      },
      {
        class: 'right-content padding-content',
        children: [
          {type: 'box-list', name: 'boxList', slot: 'right-content'},
          {type: 'pagination', slot: 'foot-page', dep: 'pagination'}
        ]
      }
    ]
  },
  buildData (meta, data) {
    return () => {
      const options = meta.options || {}
      const model = options.pagination ? {content: [], totalElements: 0} : []
      const loader = new DataLoader(options.listUrl, this.page, 'model')
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
    const {pagination, treeParam, searchTree, refProp = 'id'} = meta.options
    return {
      initPage () {
        const vm = this
        vm.treeLoad()
      },
      currentNodeChange () {
        this.refresh()
      },
      searchTree (value) {
        const vm = this
        vm.$refs.leftTree.filter(value)
      },
      reset () {
        searchTree && this.$refs.searchTee.reset()
        this.$parent.reset && this.$parent.reset()
        this.$refs.boxList.reset()
      },
      getData () {
        const boxList = this.$refs.boxList
        const item = boxList.getCurrentItem()
        const r = {value: item[refProp], label: item[boxList.label]}
        this.reset()
        return r
      },
      search (keyword) {
        const vm = this
        if (!keyword) {
          const container = vm.$parent.$parent
          keyword = container.getKeyword && container.getKeyword()
        }
        vm.loader.setParameter('keyword', keyword)
      },
      refresh () {
        const vm = this
        const node = vm.treeGetCurrent()
        if (node) {
          vm.loader.setParameter(treeParam, node.id === ALL_DATA ? null : node.id)
        } else {
          vm.model = pagination ? {content: [], totalElements: 0} : []
        }
      }
    }
  }
}
