import Vue from 'vue'
import Router from 'vue-router'
import treeList from '@/components/tree-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'treeList',
      component: treeList
    }
  ]
})
