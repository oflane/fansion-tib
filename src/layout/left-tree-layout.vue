<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<template>
    <div class="min-height-300 content-relative">
      <div class="left-tree">
        <slot name="leftTree"/>
      </div>
      <div class="right-content margin-content">
        <slot></slot>
      </div>
    </div>
</template>
<script>
import fase from 'fansion-base'
import {backend} from '~/const'

const {gson} = fase.rest
const DataLoader = fase.DataLoader
const { isNotEmpty } = fase.util
const emptyData = {totalElements: 0, content: []}
const urls = {
  loadPublicTree: backend('/category/find-tree/public-proccs'),
  loadPublic: backend('/proccs/find-public'),
  loadPrivate: backend('/proccs/find-private'),
  search: backend('/proccs/find-public-private'),
  translate: backend('/proccs/load/:value')
}
export default {
  name: 'proccs-ref',
  label: '处理单元业务引用',
  dialog: true,
  suggest: urls.search,
  translate: urls.translate,
  props: {
    processor: String
  },
  data () {
    const showPrivate = !!this.processor && this.processor !== 'null'
    const selScope = showPrivate ? 'private' : 'public'
    const privateItems = []
    const publicTree = []
    const publicItems = emptyData
    const publicLoader = new DataLoader(urls.loadPublic, this, 'publicItems')
    const searchItems = emptyData
    const searchLoader = new DataLoader(urls.search, this, 'searchItems')
    if (isNotEmpty(this.processor)) {
      searchLoader.setParameter('processor', this.processor, false)
    }
    const rightClass = showPrivate ? '' : 'right-content'
    return {
      visible: true,
      rightClass,
      showPrivate,
      searchState: false,
      selScope,
      privateItems,
      publicTree,
      publicItems,
      publicLoader,
      searchItems,
      searchLoader
    }
  },
  watch: {
    selScope (v) {
      if (v === 'private') {
        this.rightClass = ''
        this.loadPrivate()
      } else {
        this.rightClass = 'right-content'
        this.loadPublic()
      }
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    reset () {
      const vm = this
      const searchList = vm.$refs.searchList
      const publicList = vm.$refs.publicList
      const privateList = vm.$refs.privateList
      searchList && searchList.reset()
      publicList && publicList.reset()
      privateList && privateList.reset()
    },
    getData () {
      const vm = this
      const listName = vm.searchState ? 'searchList' : (vm.selScope === 'public' ? 'publicList' : 'privateList')
      const item = vm.$refs[listName].getCurrentItem()
      const r = {value: item.id, label: item.label}
      this.reset()
      return r
    },
    tagType (item) {
      return item.accessScope === 'public' ? 'success' : 'primary'
    },
    refresh () {
      const vm = this
      if (vm.selScope === 'private') {
        vm.loadPrivate()
      } else {
        vm.loadPublic()
      }
    },
    currentNodeChange (nodeData) {
      if (nodeData) {
        this.publicLoader.setParameter('category', nodeData.id, false)
        this.publicLoader.load(true)
      } else {
        this.publicItems = emptyData
      }
    },
    filterNode (value, data) {
      return !value || data.label.indexOf(value) !== -1
    },
    loadPrivate () {
      const vm = this
      if (vm.privateItems.length === 0 && isNotEmpty(vm.processor)) {
        gson(urls.loadPrivate, {processor: vm.processor}, res => {
          vm.privateItems = res
        })
      }
    },
    loadPublic () {
      const vm = this
      if (vm.publicTree.length === 0) {
        gson(urls.loadPublicTree, null, res => (vm.publicTree = res))
      }
    },
    search (kw) {
      const vm = this
      this.searchState = isNotEmpty(kw)
      if (this.searchState) {
        vm.searchLoader.setParameter('keyword', kw)
        vm.rightClass = ''
      } else if (vm.selScope === 'private') {
        vm.rightClass = ''
      } else {
        vm.rightClass = 'right-content'
      }
    },
    show () {
      this.visible = true
      this.$emit('open', this.$refs.content)
    },
    isVisible () {
      return this.visible
    },
    hide () {
      this.visible = false
      this.$emit('close', this.$refs.content)
    },
    onOk () {
      const vm = this
      const data = vm.getData()
      if (data) {
        this.$closeReference(data)
      }
    },
    onCancel () {
      this.$closeReference()
    },
    onClear () {
      this.reset()
    }
  }
}
</script>
<style scoped lang="less">
.tab-center {
  position: absolute;
  top:16px;
  left: 0;
  width: 100%;
  text-align: center;
}
.alter-item {
  overflow: hidden;
}
.mini-alter {
  min-height: 368px;
}
.mini-alter-private {
  min-height: 400px;
}
.content-center{
  background: #f5f5f5;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
