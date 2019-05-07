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
        <input type="checkbox"
               id="checkbox"
               v-model="checked">
        <label for="checkbox">{{ checked }}</label>
        <span class="tree-label">{{list.label}}</span>
      </div>
      <div class="group"
           v-for="(item2, index) in list.children"
           :key="index">
        <tree-menu v-show="open"
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
    name: 'tree-menu',
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
        currentId: '',
        isCurrent: true,
        open: false,
        checked: false,
      }
    },
    computed: {
      isFolder () {
        return this.list.children && this.list.children.length
      }
    },
    created () {
      rootTree = this.findRoot(this)
    },
    methods: {
      increaseDepth () {
        return this.depth + 1
      },
      showSubMenu (data, event) {
        const target = event.target
        this.checked = !this.checked
        if (target.type === 'checkbox') {
          const treeMenu = this.findRoot(this, 'treeMenu')
          this.selectChildrenAll(treeMenu, this.checked)
          return
        }
        if (this.isFolder) {
          this.open = !this.open
        }
        let treeParent = rootTree.$parent
        // 抛出事件
        treeParent.emitNodeClicked(data, this)
        // 遍历所有节点，设置未点击的节点为未点击状态
        for (let i = 0; i < treeParent.$children.length; i++) {
          if (selectedId !== this.list.id) {
            let nodeStack = [treeParent.$children[i]]
            while (nodeStack.length != 0) {
              let item = nodeStack.shift()
              item.isClicked = false
              if (item.$children && item.$children.length > 0) {
                nodeStack = nodeStack.concat(item.$children)
              }
            }
          }
        }
        this.currentId = data.id
        selectedId = this.list.id
        this.isClicked = true
        this.isCurrent = !this.isCurrent
      },
      // 递归查找最顶层那个name为who的组件
      findRoot (which, who = 'treeMenu') {
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
      selectChildrenAll (component, state) {
        console.log(state)
        // 遍历所有节点，设置未点击的节点为未点击状态
        let nodeStack = component.$children
        for (let i = 0; i < nodeStack.length; i++) {
          let item = nodeStack[i]
          item.checked = state
          // console.log(item)
          if (item.$children && item.$children.length > 0) {
            nodeStack = nodeStack.concat(item.$children)
            this.selectChildrenAll(nodeStack, state)
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

  .fade-enter-active,
  .fade-leave-active {
    transition: height 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }
</style>