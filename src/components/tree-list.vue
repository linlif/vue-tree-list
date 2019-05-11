<template>
  <div class="tree">
    <!-- <div v-for="(item, index) in list"
         :key="index"> -->
    <treeMenu v-for="(item, index) in list"
              :key="index"
              :list="item"
              v-bind="$attrs" />
    <!-- </div> -->
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
        let list = this.list
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (i === 2) {
            // this.initData(item)
            this.handleChildrens(item)
          }
        }
      },
      initData (node) {
        // 非递归深度优先遍历（借助栈实现）
        if (!node || !node.children) { return }
        let _stack = [] // 借助一个栈
        _stack.unshift(node);
        while (_stack && _stack.length) {
          let _curNode = _stack.shift() // 推出栈顶元素
          // console.log(_curNode.id);
          if (_curNode.children && _curNode.children.length) {
            _stack = _curNode.children.concat(_stack);
          }
        }
      },
      // 查找所有子节点
      findChildrens (node) {
        let id = node.id
        // 非递归广度优先遍历（借助队列实现）
        if (!node || !node.children) { return; }
        let _queue = []; // 借助一个队列
        let arr = []
        _queue.push(node);
        while (_queue.length) {
          let _curNode = _queue.shift(); // 推出队头元素
          console.log(_curNode.id);
          id !== _curNode.id ? arr.push(_curNode) : ''
          if (_curNode.children && _curNode.children.length) {
            _queue = _queue.concat(_curNode.children);
          }
        }
        console.log(arr)
        return arr
      },
      // 处理子树
      handleChildrens (data) {
        const defaultCheckedKeys = this.$attrs['default-checked-keys'] || []
        let children = data.children || []
        let checkedArr = []
        for (let i = 0; i < children.length; i++) {
          let item = children[i]
          item.$parent = data
          if (defaultCheckedKeys.includes(item.id)) {
            item.checked = true
          }
          // 递归
          if (item.children && item.children.length > 0) {
            this.handleChildrens(item)
          }
        }
      },
      // 处理父树
      handleParents (data) {
        let parent = data.$parent
        while (parent && parent.length !== 0) {
          let parentChildren = parent.children
          let childrenCheckState = []
          for (let i = 0; i < parentChildren.length; i++) {
            let item = parentChildren[i]
            childrenCheckState.push({
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
