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
        <input type="checkbox" />
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
      }
    },
    computed: {
      isFolder () {
        return this.list.children && this.list.children.length
      }
    },
    created () {
      rootTree = this.findRoot(this)
      // console.log(rootTree)
    },
    methods: {
      increaseDepth () {
        return this.depth + 1
      },
      showSubMenu (item, event) {
        console.log(event)
        if (this.isFolder) {
          this.open = !this.open
        }
        // 遍历所有节点，设置未点击的节点为未点击状态
        let treeParent = rootTree.$parent
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
        this.currentId = item.id
        selectedId = this.list.id
        this.isClicked = true
        this.isCurrent = !this.isCurrent
      },
      // 返回最顶层那个组件
      findRoot (which) {
        let ok = false
        let that = which
        while (!ok) {
          // 根据组件name来判断
          if (that.$options._componentTag === 'treeMenu') {
            ok = true
            // 交换两者的数据
            break
          }
          that = that.$parent
        }
        return that
      }
    }
  }
</script>

<style scoped>
  ul {
    list-style: none;
    padding-inline-start: 18px;
  }
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