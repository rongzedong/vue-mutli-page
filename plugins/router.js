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
      role: []
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

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}


// 参考 https://github.com/PanJiaChen/vue-element-admin/ 的 src/permission.js 通过role来控制 router
// accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
// if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
//     } else {
//       // determine whether the user has obtained his permission roles through getInfo
//       const hasRoles = store.getters.roles && store.getters.roles.length > 0
// if (hasRoles) {
// try {
//    // get user info
//    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
//    const { roles } = await store.dispatch('user/getInfo')

//    // generate accessible routes map based on roles
//    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

//    // dynamically add accessible routes
//    router.addRoutes(accessRoutes)

//    // hack method to ensure that addRoutes is complete
//    // set the replace: true, so the navigation will not leave a history record
//    next({ ...to, replace: true })
//  } catch (error) {
//    // remove token and go to login page to re-login
//    await store.dispatch('user/resetToken')
//    Message.error(error || 'Has Error')
//    next(`/login?redirect=${to.path}`)
//    NProgress.done()
//  }

// 添加导航守卫
router.beforeEach((to, from, next) => {

  // 修改页面的 title 如果在 router里 定义了 meta的 title name就把它设置为 title
  // console.log(to)
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
