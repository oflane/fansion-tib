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
  name: '矩阵列表',
  options: [
    {
      type: 'reference',
      label: '查询服务: ',
      field: 'listUrl',
      refTo: 'fasm:application-modeling:ref:services',
      placeholder: '格子列表数据记载的url',
      validation: [
        {required: true, message: '列表查询URL不能为空', trigger: 'blur'}
      ]
    },
    {
      type: 'input',
      label: '引用值字段: ',
      field: 'refProp',
      placeholder: '引用对应的值字段'
    }
  ],
  layout: {
    class: 'content-relative',
    children: [
      {
        class: 'min-height-400 padding-content',
        comp: {type: 'box-list', name: 'boxList', 'm-label': '块列表', ':model': 'model', '@dblclick': 'reference"'}
      },
      {
        class: 'clearfix',
        comp: {type: 'slice', name: 'slice', ':loader': 'loader', ':model': 'model', dep: '是否分片', nco: true}
      }
    ]
  },
  buildData (meta, data) {
    return function () {
      const vm = this
      const options = meta.options || {}
      const model = options.slice ? {content: [], last: true} : []
      const loader = new DataLoader(options.listUrl, vm.page || this, 'model')
      loader.setVueCompAttrs(vm)
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
  builders: {
    boxList (c, meta) {
      const {slice} = meta.options
      const label = meta.boxList.label || 'label'
      return Object.assign({ref: c.name, pos: c.slot}, c, {label, ':model': slice ? 'model.content' : 'model'})
    }
  },
  watch: {
    sliceData (v) {
      v && v.content.length > 0 && (this.model = this.model.concat(v.content))
    }
  },
  methods (meta) {
    /**
     * 元数据
     */
    const {refProp = 'id'} = meta.options
    return {
      /**
       * 初始化界面
       */
      initPage () {
        const vm = this
        vm.refresh()
      },
      /**
       * 重置搜索
       */
      reset () {
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
        if (!item) {
          return
        }
        const r = Object.assign({}, item, {value: item[refProp], label: item[boxList.label]})
        this.reset()
        return r
      },
      reference (item) {
        this.$closeReference(item)
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
        this.model = []
        vm.loader.load(true)
      }
    }
  }
}
