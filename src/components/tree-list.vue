<template>
  <div class="tree">
    <div v-for="(item, index) in list"
         :key="index">
      <treeMenu :list="item" />
    </div>
  </div>
</template>

<script>
  import treeMenu from './tree-menu'

  export default {
    name: 'treeList',
    props: {
      list: Array
    },
    components: {
      treeMenu
    },
    methods: {
      // 节点被点击时的回调
      emitNodeClicked (data, component) {
        this.$emit('node-click', data, component)
      },
      // 节点选中状态发生变化时的回调
      emitCheckChange (data, checked, isChildHasChecked) {
        this.$emit('check-change', data, checked, isChildHasChecked)
      },
      // 当复选框被点击的时候触发 checkedState:{checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys}
      emitCheck (data, checkedState) {
        this.$emit('check', data, checkedState)
      },
      // 当前选中节点变化时触发的事件
      emitCurrentChange (data, curNode) {
        this.$emit('check', data, curNode)
      },
      // 节点被展开时触发的事件
      emitNodeExpand (data, curNode, component) {
        this.$emit('check', data, curNode, component)
      },
      // 节点被关闭时触发的事件
      emitNodeCollapse (data, curNode, component) {
        this.$emit('check', data, curNode, component)
      },
    }
  }
</script>
