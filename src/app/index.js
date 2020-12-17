/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

const templates = {
  'tib.app.simple-table': import('./plain/table/simple-table.tpl.js'),
  'tib.app.simple-form': import('./plain/form/simple-form.tpl.js'),
  'tib.app.of-simple-table': import('./of/table/simple-table.tpl.js'),
  'tib.app.of-simple-form': import('./of/form/simple-form.tpl.js')
}
const temetas = {
  'tib.app.simple-table': () => import('./plain/table/simple-table.temeta.js'),
  'tib.app.simple-form': () => import('./plain/form/simple-form.temeta.js'),
  'tib.app.of-simple-table': () => import('./ofm/table/simple-table.temeta.js'),
  'ofm-simple-form': () => import('./ofm/form/simple-form.temeta.js')
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
