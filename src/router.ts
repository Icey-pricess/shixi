import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import Signup from './views/Signup.vue'
import PostDetail from './views/PostDetail.vue'
import EditUser from './views/EditUser.vue'
import store from './store'
import axios from 'axios'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { redirectAlreadyLogin: true }
  }, {
    path: '/columnDetail/:id',
    name: 'columnDetail',
    component: ColumnDetail
  }, {
    path: '/createPost',
    name: 'createPost',
    component: CreatePost,
    meta: {
      requiredLogin: true
    }
  }, {
    path: '/signup',
    name: 'signup',
    component: Signup
  }, {
    path: '/postDetail/:id',
    name: 'postDetail',
    component: PostDetail
  }, {
    path: '/edit',
    name: 'edit',
    component: EditUser
  }]
})
router.beforeEach((to, from, next) => {
  const { token, user } = store.state
  const { redirectAlreadyLogin, requiredLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch((error) => {
        console.log('获取用户信息失败', error)
        next('/login')
        store.commit('logout')
      })
    } else {
      if (requiredLogin) {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
