<template>
  <div>
    <div class="treeitem"
         @click.stop="showSubMenu(list, $event)">
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
        <span class="tree-label">{{list.label}}</span>
      </div>
      <div class="group"
           v-for="(item2, index) in list.children"
           :key="index">
        <treeMenu v-show="open"
                  v-if="isFolder"
                  :list="item2"
                  :depth="increaseDepth()" />
      </div>
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
      list: {
        type: Object,
        default: () => {
          [{
            label: '一级 1',
            children: [{
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1'
              }]
            }]
          }, {
            label: '一级 2',
            children: [{
              label: '二级 2-1',
              children: [{
                label: '三级 2-1-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }]
          }, {
            label: '一级 3',
            children: [{
              label: '二级 3-1',
              children: [{
                label: '三级 3-1-1'
              }]
            }, {
              label: '二级 3-2',
              children: [{
                label: '三级 3-2-1'
              }]
            }]
          }]
        }
      }
    },
    data () {
      return {
        isClicked: false,
        isCurrent: true,
        open: false,
        checked: '',
        justUnselected: false // 是否刚刚取消的CheckBox，true时高亮边框，false时置灰边框
      }
    },
    computed: {
      isFolder () {
        return this.list.children && this.list.children.length
      },
      checkboxClass () {
        if (this.checked === true) {
          return 'iconcheckbox-xuanzhong checked'
        } else if (this.checked === 'some') {
          return 'iconcheckbox-xuanzhongbufen some'
        } else {
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
    },
    methods: {
      increaseDepth () {
        return this.depth + 1
      },
      showSubMenu (data, event) {
        const role = event.target.dataset.role
        // 如果点击的是checkbox
        if (role === 'checkbox' || role === 'label') {
          let treeMenu = this.findNode(this, 'treeMenu')
          this.checked = !this.checked
          this.selectChildrenNodes(treeMenu, this.checked)
          this.handleSelect(treeMenu)
          // 重置其他节点状态
          this.nomalizeNodes(this, rootTree, true)
          this.justUnselected = true
          selectedId = this.list.id
          return
        } else {
          // 抛出事件
          rootTree.emitNodeClicked(data, this)
          // 打开/关闭菜单
          if (this.isFolder) {
            this.open = !this.open
          }
          // 重置其他节点状态
          this.nomalizeNodes(this, rootTree, false)
          selectedId = this.list.id
          this.isClicked = true
          this.isCurrent = !this.isCurrent
        }
      },
      // 递归查找name为who的组件
      findNode (which, who = 'treeMenu') {
        let ok = false
        let that = which
        while (!ok) {
          // 根据组件name来判断
          if (that.$options._componentTag === who) {
            ok = true
            // 交换两者的数据
            break
          }
          that = that.$parent
        }
        return that
      },
      // 选中/取消所有子节点
      selectChildrenNodes (component, state) {
        let nodeStack = component.$children
        for (let i = 0; i < nodeStack.length; i++) {
          let item = nodeStack[i]
          item.checked = state
          if (item.$children && item.$children.length > 0) {
            nodeStack = nodeStack.concat(item.$children)
          }
        }
      },
      // 处理组件的半选中状态
      handleSelect (component) {
        let parent = component.$parent
        let allChecked = true
        while (parent.$options._componentTag !== 'treeList') {
          let parentChildren = parent.$children
          for (let i = 0; i < parentChildren.length; i++) {
            let item = parentChildren[i]
            if (!item.checked || item.checked === 'some') {
              allChecked = false
            }
          }
          allChecked ? parent.checked = true : parent.checked = 'some'
          parent = parent.$parent
        }
      },
      // 未点击的节点置为未选中状态，点击非CheckBox取消边框高亮
      nomalizeNodes (which, treeParent, isCheckBox = false) {
        const that = which
        for (let i = 0; i < treeParent.$children.length; i++) {
          let nodeStack = [treeParent.$children[i]]
          while (nodeStack.length != 0) {
            let item = nodeStack.shift()
            if (selectedId !== that.list.id) {
              item.isClicked = false
              item.justUnselected = false
            } else {
              if (!isCheckBox) {
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
  .treeroot {
    padding-left: 0;
  }
  .tree {
    /* padding-left: 18px; */
  }
  .treeitem {
    user-select: none;
  }
  .tree-content {
    color: #606266;
    display: flex;
    align-items: center;
    height: 26px;
    cursor: pointer;
    /* margin-left: 18px; */
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