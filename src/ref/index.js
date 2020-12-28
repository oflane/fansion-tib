/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import builder from '../builder'

const templates = {
  'tib.ref.tree-box-list': () => builder.facber.buildTemplate(import('./tree-box-list/tree-box-list.tpl.js'))
}
const temetas = {
  'tib.ref.tree-box-list': {type: 'ref', temeta: () => builder.facber.buildTemeta(import('./tree-box-list/tree-box-list.tpl.js'))}
}
/**
 * 组件入口
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/13/18
 */
export default {
  templates,
  temetas
}
