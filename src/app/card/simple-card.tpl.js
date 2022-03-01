/* eslint-disable no-eval,no-new-func */
/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import fase from 'fansion-base'
import fui from "fansion-ui";

const {furl, gson} = fase.rest
const {handler, msg} = fui
/**
 * 简单表单卡片
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
export default {
  name: '简单卡片',
  options: [
    {
      type: 'reference',
      label: '加载服务: ',
      field: 'load',
      refTo: 'fasm:application-modeling:ref:services',
      validation: [
        {required: true, message: '编辑地址不能为空', trigger: 'blur'}
      ]
    },
    {
      type: 'reference',
      label: '保存服务: ',
      field: 'save',
      refTo: 'fasm:application-modeling:ref:services',
      validation: [
        {required: true, message: '保存地址不能为空', trigger: 'blur'}
      ]
    }
  ],
  layout: {
    header: {
      type: 'button-bar',
      name: 'buttonBar',
      slot: 'header',
      buttons: [
        {
          name: '保存',
          click: 'save',
          type: 'primary' // success warning danger info
        },
        {
          name: '取消',
          click: 'cancel'
        }
      ],
      nco: true
    },
    body: {
      type: 'fac-form',
      name: 'facForm',
      'm-label': '表单',
      slot: 'body'
    }
  },
  buildData () {
    return function () {
      return {
        model: {}
      }
    }
  },
  builders: {
    facForm (c, meta) {
      if (meta.facForm) {
        return Object.assign({ref: c.name, pos: c.slot}, c, meta.facForm)
      }
    }
  },
  methods (meta) {
    return {
      initPage() {
        const vm = this
        const id = vm.$attrs.id ? vm.$attrs.id : vm.$route.params.id
        if (id === fase.constant.ADD_ID) {
          vm.model = {}
        } else {
          gson(furl(meta.options.load, {id})).then(res => {
            vm.model = res
          })
        }
      },
      save() {
        const vm = this
        const model = vm.model
        handler.saveData({
          vm,
          form: 'facForm',
          url: meta.options.save,
          model,
          success: _ => {
            msg.success.save()
            vm.$router.back()
          },
          fail: msg.error.save,
          loading: 'pageLoading'
        })
      },
      cancel() {
        this.$router.back()
      }
    }
  }
}
