/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import builder from "../builder";

const listSimpleTable = import('./list/simple-list.tpl.js')
const listSimpleCard = import('./card/simple-card.tpl.js')
const templates = {
  'tib.plain.simple-table': import('./plain/table/simple-table.tpl.js'),
  'tib.plain.simple-form': import('./plain/form/simple-form.tpl.js'),
  'tib.app.of-simple-table': import('./of/table/simple-table.tpl.js'),
  'tib.app.of-simple-form': import('./of/form/simple-form.tpl.js'),
  'tib.app.list.simple-list': () => builder.facber.buildTemplate(listSimpleTable),
  'tib.app.card.simple-card': () => builder.facber.buildTemplate(listSimpleCard)
}
const temetas = {
  'tib.app.simple-table': () => import('./plain/table/simple-table.temeta.js'),
  'tib.app.simple-form': () => import('./plain/form/simple-form.temeta.js'),
  'tib.app.of-simple-table': () => import('./of/table/simple-table.temeta.js'),
  'ofm-simple-form': () => import('./of/form/simple-form.temeta.js'),
  'tib.app.list.simple-list': {type: 'app', temeta: () => builder.facber.buildTemeta(listSimpleTable)},
  'tib.app.card.simple-card': {type: 'app', temeta: () => builder.facber.buildTemeta(listSimpleCard)}
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
