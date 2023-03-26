import { createRouter, createWebHistory } from 'vue-router'
import { MenuList } from '@/utils/setting.js'

const module = import.meta.glob(['@/views/*/*/Index.vue', '@/views/*/Index.vue'])
// 动态加载路由
const loadRoute = (arr) => {
  const route = arr.map(el => {
    if (el.children) {
      const children = loadRoute(el.children)
      const temp = {
        ...el,
        children,
      }
      return temp
    } else {
      const temp = {
        ...el,
        component: module[el.component],
      }
      return temp
    }
  })
  return route
}
const route = loadRoute(MenuList)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/Layout/Index.vue'),
      redirect: 'forum/article',
      children: [
        ...route
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/Index.vue'),
    }
  ]
})

router.beforeEach((to,from,next)=>{
  document.title = to.meta.label
  next()
})

export default router
