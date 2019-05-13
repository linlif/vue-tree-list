<template>
  <div class="tree">
    <treeMenu v-for="(item, index) in list"
              :key="index"
              :list="item"
              v-bind="$attrs" />
  </div>
</template>

<script>
  import treeMenu from './tree-menu'
  let parentData = {}
  export default {
    name: 'treeList',
    props: {
      list: Array
    },
    components: {
      treeMenu
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let list = this.list
        for (let i = 0, iLen = list.length; i < iLen; i++) {
          this.setState(list[i], false)
          this.check(list[i], true)
        }
      },
      setState (node, state) {
        if (!node) return
        node.checked = state
        parentData[node.id] = node // 缓存节点对象
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            let item = node.children[i]
            item.parent = node.id // 保存父节点id
            item.checked = state
            this.setState(item, state)
          }
        }
      },
      check (node, state) {
        if (!node) return
        const arr = this.$attrs['default-checked-keys']
        if (arr.indexOf(node.id) !== -1) {
          this.setState(node, state)
        }
        // 递归选中children及其子节点
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            let item = node.children[i]
            this.check(item, state)
          }
        }
        // 处理父节点的选中状态
        this.checkParent(node)
      },
      checkParent (node) {
        let parent = parentData[node.parent] || {}
        let children = parent.children || []
        let checkedNum = 0, unCheckedNum = 0;
        for (let i = 0, iL = children.length; i < iL; i++) {
          let item = children[i]
          if (item.checked === true) {
            checkedNum++
          } else if (!item.checked) {
            unCheckedNum++
          }
        }
        if (checkedNum === children.length) {
          parent.checked = true
        } else if (unCheckedNum === children.length) {
          parent.checked = false
        } else {
          parent.checked = 'some'
        }
      },
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
