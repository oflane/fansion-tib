/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import fase from 'fansion-base'
import fac from 'fansion-fac'
import builder from './builder'
import app from './app'
import ref from './ref'
const install = (Vue, opt = {}) => {
  fase.init({})
  fac.init({templates: {...app.templates, ...ref.templates}})
  fase.plugin.init5Exist('fansion-meta', () => ({temetas: { ...app.temetas, ...ref.temetas}}))
}
/**
 * 组件入口
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/13/18
 */
export default {
  install,
  ...builder
}
