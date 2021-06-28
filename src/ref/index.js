/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import builder from '../builder'

const treeBoxList = import('./tree-category/tree-box-list.tpl.js')
const boxListSlice = import('./list/box-list-slice.tpl.js')
const templates = {
  'tib.ref.tree-box-list': () => builder.facber.buildTemplate(treeBoxList),
  'tib.ref.box-list-slice': () => builder.facber.buildTemplate(boxListSlice)
}
const temetas = {
  'tib.ref.tree-box-list': {type: 'ref', temeta: () => builder.facber.buildTemeta(treeBoxList)},
  'tib.ref.box-list-slice': {type: 'ref', temeta: () => builder.facber.buildTemeta(boxListSlice)}
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
