/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import fase from 'fansion-base'
import fac from 'fansion-fac'
import plainSimpleTable from './plain/table/simple-table.tpl.js'
import plainSimpleForm from './plain/form/simple-form.tpl.js'
import ofmSimpleTable from './ofm/table/simple-table.tpl.js'
import ofmSimpleForm from './ofm/form/simple-form.tpl.js'

const templates = {
  'plain-simple-table': plainSimpleTable,
  'plain-simple-form': plainSimpleForm,
  'ofm-simple-table': ofmSimpleTable,
  'ofm-simple-form': ofmSimpleForm
}
const install = (Vue, opt = {}) => {
  fase.init({})
  fac.init({templates})
  fase.util.init5Exist('fansion-meta', () => {
    return {
      temetas: {
        'plain-simple-table': () => import('./plain/table/simple-table.temeta.js'),
        'plain-simple-form': () => import('./plain/form/simple-form.temeta.js'),
        'ofm-simple-table': () => import('./ofm/table/simple-table.temeta.js'),
        'ofm-simple-form': () => import('./ofm/form/simple-form.temeta.js')
      }
    }
  })
}
/**
 * 组件入口
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/13/18
 */
export default {
  install
}
