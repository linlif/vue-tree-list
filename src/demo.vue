<template>
  <div>
    <treeList :list="list"
              @node-click="nodeClicked"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[8,12,15,16]" />
  </div>
</template>

<script>
  import treeList from "./components/tree-list";
  export default {
    components: {
      treeList,
    },
    data () {
      return {
        list: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
              id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '四级 4-1',
              children: [{
                id: 14,
                label: '四级 4-1-1'
              }, {
                id: 15,
                label: '四级 4-1-2'
              }, {
                id: 16,
                label: '四级 4-1-3'
              }]
            }]
          }]
        }]
      }
    },
    methods: {
      nodeClicked (data, component) {
        // console.log('data:', data)
        // console.log('component:', component)
      }
    }
  }
</script>

