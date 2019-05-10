<template>
  <div class="tree">
    <div v-for="(item, index) in list"
         :key="index">
      <treeMenu :list="item"
                v-bind="$attrs" />
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
    created () {
      this.init()
    },
    methods: {
      init () {
        // console.log(this.list)
        let list = this.list
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (i === 2) {
            this.handleChildrens(item)
          }
        }
      },
      // 处理子树
      handleChildrens (data) {
        console.log('111', data)
        const defaultCheckedKeys = this.$attrs['default-checked-keys'] || []
        let children = data.children || []
        let checkedArr = []
        for (let i = 0; i < children.length; i++) {
          let item = children[i]
          if (defaultCheckedKeys.includes(item.id)) {
            item.checked = true
          }
          checkedArr.push({
            id: item.id,
            label: item.label,
            checked: item.checked
          })
          console.log(item)
          // 递归
          if (item.children && item.children.length > 0) {
            // console.log(checkedArr)
            this.handleChildrens(item)
          }
          console.log('2222', item)
        }
        if (checkedArr.every((curVal) => { return curVal.checked === true })) {
          data.checked = true
        } else if (checkedArr.every((curVal) => { return curVal.checked === false })) {
          data.checked = false
        } else {
          data.checked = 'some'
        }
        // console.log(checkedArr)
      },
      // 处理父树
      handleParents (component) {
        let parent = component.$parent
        while (parent.$options._componentTag !== 'treeList') {
          let parentChildren = parent.$children
          let childrenCheckState = []
          for (let i = 0; i < parentChildren.length; i++) {
            let item = parentChildren[i]
            childrenCheckState.push({
              id: item.list.id,
              label: item.list.label,
              checked: item.checked
            })
          }
          if (childrenCheckState.every((curVal) => { return curVal.checked === true })) {
            parent.checked = true
          } else if (childrenCheckState.every((curVal) => { return !(curVal.checked) })) {
            parent.checked = false
          } else {
            parent.checked = 'some'
          }
          parent = parent.$parent
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
