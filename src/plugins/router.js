// 这个作为插件保存在这里，也可以单独建立router目录，存在那边，当然要修改对应的引用文件里的内容
import Vue from 'vue'
import VueRouter from 'vue-router'
import viewHome from '../views/viewHome.vue'
import viewLogin from '../views/Login.vue'
import viewRegister from '../views/Register.vue'

Vue.use(VueRouter)

const routes = [
  // 根目录重定向到 /home/login
  // {
  //   path: '/',
  //   redirect: '/home/login'
  // },
  {
    path: '/',
    title: 'title',
    component: viewHome,
  },
  {
    path: '/home',
    title: 'home',
    component: viewHome,
    children: [
      // 当 /home/login 匹配成功，Login会被渲染在Home的<router-view>中
      // { path: 'login', component: viewLogin },
      // 当 /home/register 匹配成功，Register会被渲染在Home的<router-view>中
      // { path: 'register', component: viewRegister }
    ]
  },
  {
    path: '/login',
    meta: {
    title: 'login',
    },
    component: viewLogin
  },
  {
    path: '/register',
    title: 'reg',
    component: viewRegister
  },
]

const router = new VueRouter({
  routes
})

// document.title = getPageTitle(to.meta.title)
//  export default function getPageTitle(pageTitle) {
//   if (pageTitle) {
//     return `${pageTitle} - ${title}`
//   }
//   return `${title}`
// }

import defaultSettings from '@/settings'
const title = defaultSettings.title || 'vue-mutli-page'

// 添加导航守卫
router.beforeEach((to, from, next) => {

  console.log(to)
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${title}`
  }else{
    document.title = `${title}`
  }

  // 如果目标路由为登录或注册页面，直接放行
  if (to.path === '/' || to.path === '/login' || to.path === '/register') {
    return next()
  }
  // 获取token值
  const token = sessionStorage.getItem('token')
  // 如果token值不存在，则跳转到登录页面
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
