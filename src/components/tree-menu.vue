<template>
  <div class="treeitem"
       @click.stop="handleClicked(list, $event)">
    <div class="tree-content"
         :style="{ 'padding-left': (depth - 1) * 18 + 'px' }"
         :class="isClicked?'is-expanded is-current':''">
      <i v-if="list.children"
         class="iconfont"
         :class="isCurrent?'iconsanjiaoright':'iconsanjiaodown'"></i>
      <input data-role="checkbox"
             type="checkbox"
             :id="'checkbox'+list.id"
             style="display:none"
             v-model="checked">
      <label data-role="checkbox"
             class="iconfont tree-checkbox-icon"
             :class="checkboxClass"
             :for="'label'+list.id"></label>
      <span class="tree-label">{{list.id}}:{{list.label}}</span>
    </div>
    <div class="group"
         v-for="(item2, index) in list.children"
         :key="index">
      <treeMenu v-show="open"
                v-if="isFolder"
                :list="item2"
                v-bind="$attrs"
                :depth="increaseDepth()" />
    </div>
  </div>
</template>

<script>
  let selectedId = ''
  let rootTree = ''
  export default {
    name: 'treeMenu',
    props: {
      depth: {
        type: Number,
        default: 1
      },
      list: Object
    },
    data () {
      return {
        isClicked: false,
        isCurrent: true,
        open: true,
        checked: false,
        justUnselected: false // 是否刚刚取消的CheckBox，true时高亮边框，false时置灰边框
      }
    },
    computed: {
      isFolder () {
        return this.list.children && this.list.children.length > 0
      },
      checkboxClass () {
        if (this.checked === true) {
          return 'iconcheckbox-xuanzhong checked'
        } else if (this.checked === 'some') {
          return 'iconcheckbox-xuanzhongbufen some'
        } else if (this.checked === false) {
          if (this.justUnselected) {
            return 'iconcheckbox-weixuan just-unchecked'
          } else {
            return 'iconcheckbox-weixuan unchecked'
          }
        }
      }
    },
    created () {
      rootTree = this.findNode(this, 'treeList')
      this.init()
    },
    methods: {
      increaseDepth () {
        return this.depth + 1
      },
      init () {
        if (this.list.checked) {
          this.checked = this.list.checked
        }
        if (this.list.expended) {
          this.expended = this.list.expended
        }
      },
      handleClicked (data, event) {
        const role = event.target.dataset.role
        // 判断点击的是checkbox组件，还是treeMenu组件
        if (role === 'checkbox' || role === 'label') {
          this.checked === 'some' ? this.checked = true : this.checked = !this.checked
          let treeMenu = this.findNode(this, 'treeMenu')
          this.handleChildrenNodes(treeMenu, this.checked)
          this.handleParentNodes(treeMenu)
          this.nomalizeNodes(this, true)
          selectedId = this.list.id
          this.justUnselected = true
          return
        } else {
          rootTree.emitNodeClicked(data, this)
          if (this.isFolder) this.open = !this.open
          this.nomalizeNodes(this, false)
          selectedId = this.list.id
          this.isClicked = true
          this.isCurrent = !this.isCurrent
        }
      },
      // 递归查找name为who的组件
      findNode (that, who = 'treeMenu') {
        let ok = false
        while (!ok) {
          if (that.$options._componentTag === who) {
            ok = true
            break
          }
          that = that.$parent
        }
        return that
      },
      // 处理子组件的选中状态
      handleChildrenNodes (component, state) {
        let nodeStack = component.$children
        for (let i = 0; i < nodeStack.length; i++) {
          let item = nodeStack[i]
          item.checked = state
          if (item.$children && item.$children.length > 0) {
            nodeStack = nodeStack.concat(item.$children)
          }
        }
      },
      // 处理父组件的选中状态
      handleParentNodes (component) {
        let parent = component.$parent
        while (parent.$options._componentTag !== 'treeList') {
          let parentChildren = parent.$children || []
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
      // 重置组件的点击状态
      nomalizeNodes (which, isCheckBox = false) {
        for (let i = 0; i < rootTree.$children.length; i++) {
          let nodeStack = [rootTree.$children[i]]
          while (nodeStack.length != 0) {
            let item = nodeStack.shift()
            if (selectedId !== which.list.id) {
              item.isClicked = false
              item.justUnselected = false
            } else {
              if (!isCheckBox) { // 点击checkbox外的组件，justUnselected为false
                item.justUnselected = false
              }
            }
            if (item.$children && item.$children.length > 0) {
              nodeStack = nodeStack.concat(item.$children)
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .treeitem {
    user-select: none;
  }
  .tree-content {
    color: #606266;
    display: flex;
    align-items: center;
    height: 26px;
    cursor: pointer;
  }
  .is-expanded {
    background: #f5f7fa;
  }
  .tree-content:hover {
    background: #f5f7fa;
  }
  .tree-checkbox-icon {
    font-size: 18px;
    color: #dcdfe6;
  }
  .tree-checkbox-icon.checked,
  .tree-checkbox-icon.just-unchecked,
  .tree-checkbox-icon.some {
    color: #409eff;
  }
</style>