import fase from 'fansion-base'

const gson = fase.rest.gson
/**
 * 树相关配置构建
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 202020/10/12
 */
const defaultComp = {
  temeta: {
    components: [
      {
        type: 'fac-form',
        cols: 1,
        ':model': 'model',
        items: [
          {
            type: 'input',
            label: '加载URL: ',
            field: 'treeLoadUrl',
            validation: [
              {required: true, message: '树加载URL地址', trigger: 'blur'}
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
  buildComp (meta) {
    return {

    }
  },
  methods (meta, comp) {
    return {
      treeLoad () {
        const vm = this
        gson(meta.treeLoadUrl).then(res => {
          if (res && res.length > 0) {
            root.children = [res]
            vm.treeModel = root
          }
        })
      },
    }
  }
}
export default {
  defaultComp
}
