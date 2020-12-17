import fase from 'fansion-base'

const typeRegister = fase.builder.typeRegister
/**
 * 模板和模板元数据构建器
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 202020/10/12
 */
const builders = {}

/**
 * 添加模板元数据
 * @param data 组件配置的元数据
 */
const addCompBuilder = typeRegister(builders, 'type', 'name', fase.util.self, 'custom')

/**
 * 获取模板元数据
 * @param name 模板名称
 * @returns {*}
 */
const getCompBuilder = (name, type) => {
  let rs = null
  if (type) {
    rs = builders[type] ? builders[type][name] : null
  } else {
    for (const t of Object.values(builders)) {
      if (t && t[name]) {
        rs = t[name]
        break
      }
    }
  }
  return rs
}
export default {
  addCompBuilder,
  getCompBuilder
}
