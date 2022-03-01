/* eslint-disable no-eval,no-new-func */
/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import fase from 'fansion-base'
import fui from "fansion-ui";

const DataLoader = fase.DataLoader
const {handler, msg} = fui
const {furl, post} = fase.rest
/**
 * 简单列表
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  name: '简单列表',
  options: [
    {
      type: 'reference',
      label: '查询服务: ',
      field: 'query',
      refTo: 'fasm:application-modeling:ref:services',
      validation: [
        {required: true, message: '查询地址不能为空', trigger: 'blur'}
      ]
    },
    {
      type: 'reference',
      label: '编辑页面: ',
      field: 'edit',
      refTo: 'fasm:application-modeling:ref:app-paths',
      placeholder: '编辑单条数据界面',
      validation: [
        {required: true, message: '编辑地址不能为空', trigger: 'blur'}
      ]
    },
    {
      type: 'reference',
      label: '删除服务: ',
      field: 'delete',
      refTo: 'fasm:application-modeling:ref:services',
      validation: [
        {required: true, message: '删除地址不能为空', trigger: 'blur'}
      ]
    }
  ],
  layout: {
    header: {
      class: 'layout-header layout-rows clearfix',
      rows: [
        {
          cols: [
            {
              ':span': 12,
              comp:{
                type: 'button-bar',
                name: 'headerButton',
                slot: 'header-button',
                buttons: [
                  {
                    name: '新增',
                    click: 'add',
                    type: 'primary' // success warning danger info
                  },
                  {
                    name: '删除',
                    click: 'deletes'
                  }
                ],
                nco: true
              }
            },
            {
              ':span': 12,
              comp: {
                type: 'search',
                name: 'headerSearch',
                slot: 'header-search',
                'm-label': '简单搜索',
                xclass: 'pull-right',
                ':loader': 'loader',
                advance: 'xqueryComp'
              }
            }
          ]
        },
        {
          name: 'xqueryComp',
          type: 'xquery',
          'm-label': '高级查询',
          slot: 'header-query',
          ':loader': 'loader'
        }
      ]
    },
    body: {
      type: 'simple-table',
      name: 'simpleTable',
      'm-label': '列表',
      slot: 'body',
      '@selection-change': 'page.handleSelectionChange($event)',
      ':loader': 'loader'
    },
    footer: {
      type: 'pagination',
      name: 'pagination',
      ':model': 'model',
      ':loader': 'loader',
      slot: 'footer',
      dep: '是否分页',
      nco: true
    }
  },
  buildData (meta) {
    return function () {
      const vm = this
      const options = meta.options || {}
      const model = options.pagination ? {content: [], totalPages: 0, totalElements:0} : []
      const loader = new DataLoader('POST:' + options.query, vm.page || this, 'model', 'POST')
      loader.setVueCompAttrs(vm)
      return {
        multipleSelection: [],
        loader,
        model
      }
    }
  },
  builders: {
    headerSearch (c, meta) {
      if (meta.headerSearch) {
        return Object.assign({ref: c.name, pos: c.slot}, c, meta.headerSearch)
      }
    },
    xqueryComp (c, meta) {
      if (meta.xqueryComp) {
        return Object.assign({ref: c.name, pos: c.slot}, c, meta.xqueryComp)
      }
    },
    simpleTable (c, meta) {
      const metaColumns = meta.simpleTable.columns || []
      const model = meta.options.pagination ? 'model.content' : ':model'
      const columns = [{ selection: true }, ...metaColumns, fui.generator.buttonsColumn([{ click: 'page.edit(scope.row)', text: '查看' }, { click: 'page.delete(scope.row)', text: '删除' }])]
      return Object.assign({ref: c.name, pos: c.slot}, c, {columns, ':model': model})
    }
  },
  methods (meta) {
    return {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      initPage () {
        this.queryData()
      },
      queryData () {
        this.loader.load()
      },
      add () {
        this.$router.push(furl(meta.options.edit, {id: fase.constant.ADD_ID}))
      },
      edit (row) {
        this.$router.push(furl(meta.options.edit, row))
      },
      delete (row) {
        const vm = this
        handler.confirmHandle({
          vm,
          msg: '删除数据操作, 是否继续?',
          csg: '已取消删除',
          handler: () => {
            let ids
            if (Array.isArray(row)) {
              ids = row.map(r => r.id)
            } else {
              ids = row.id
            }
            post(meta.options.delete, {id: ids}).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              vm.queryData()
            }).catch(() => msg.error.del())
          }
        })
      },
      deletes () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'info',
            message: '请勾选需要删除的数据!'
          })
          return
        }
        this.delete(this.multipleSelection)
      }
    }
  }
}
