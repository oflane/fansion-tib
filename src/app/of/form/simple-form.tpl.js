/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

/**
 * 表单模板
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-18
 */
import fase from 'fansion-base'
const {furl, gson, post} = fase.rest
/**
 * 简单配置开发
 */
export default meta => {
  const {options: {ofmodel}, facForm: {groups}, uimeta, methods} = meta
  const urls = {
    add: `/ofec/create/${ofmodel}`,
    load: `/ofec/load/${ofmodel}/:id`,
    save: '/ofec/save'
  }
  return {
    uimeta,
    layout: {
      conf: {
        header: 'header',
        body: 'body'
      }
    },
    components: [
      {
        type: 'button-bar',
        pos: 'header',
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
        ]
      },
      {
        type: 'fac-form',
        pos: 'body',
        groups
      }
    ],
    model: {},
    methods: Object.assign({
      initPage () {
        const vm = this
        const id = vm.$route.params.id
        let url
        if (id === 'add') {
          if (!urls.add) {
            vm.model = {}
            vm.pageState = 'state_add'
            return
          }
          url = urls.add
          vm.pageState = 'state_add'
        } else {
          url = furl(urls.load, {id})
          vm.pageState = 'state_edit'
        }

        gson(url).then(res => {
          vm.model = res
        })
      },
      save () {
        const vm = this
        vm.pageLoading = true
        console.log(vm.model)
        post(urls.save, this.model).then(() => {
          vm.$router.back()
          vm.$message({
            type: 'success',
            message: '保存成功!'
          })
          vm.pageLoading = false
        }, () => { vm.pageLoading = false })
      },
      cancel () {
        this.$router.back()
      }
    }, methods)
  }
}
