<template>
  <ul>
    <li
      v-for="(item, index) in list"
      :key="index"
    >
    <i  v-if="hasFolder">>>> </i>
    <span
        class="tree-trunk"
        :class="index"
        @click="showSubMenu(index,$event)"
      >{{index}} : {{item.label}}</span>
      <tree-menu
        v-if="item.children"
        :list="item.children"
      />
    </li>
  </ul>
</template>

<script>

export default {
  name: 'tree-menu',
  props: {
    list: {
      type: Array,
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
  data() {
    return {
      hasFolder: true,
      current: ''
    }
  },
  created(){
      this.hasFolder = this.list.children && this.list.children.length
  },
  methods: {
    showSubMenu(index, event) {
      console.log(index)
      console.log(event)
      this.current = index
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
.tree-trunk {
  color: #606266;
  cursor: pointer;
}
/* .tree-trunk:before {
  content: "\e791";
} */
.tree-trunk:hover {
  background: #f5f7fa;
}
</style>