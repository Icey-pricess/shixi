<template>
<div class="navbarcontainer">
  <nav class="navbar navbar-light justify-content-between mb-4 px-4 box-shadow bg-white" :class="{'fiexed':isFiexd}">
    <router-link class="navbar-brand text-primary fs-3" to="/">时习<span class="fs-6 text-muted px-4">学而时习之 不亦说乎</span></router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0 ">
      <li class="list-inline-item"><router-link to="/login" class="nav-link">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="nav-link ">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <dropdown :title="user.nickName">
        <template v-slot:dropdown>
          <dropdown-item><router-link to="/createPost" class="dropdown-item">新建文章</router-link></dropdown-item>
          <dropdown-item><router-link :to="`/columnDetail/${user.column}`" class="dropdown-item">我的专栏</router-link></dropdown-item>
          <dropdown-item closeAfterClick><router-link to="/edit" class="dropdown-item">编辑资料</router-link></dropdown-item>
          <dropdown-item><a href="#" class="dropdown-item" @click="logout">退出登录</a></dropdown-item>
        </template>
      </dropdown>
    </ul>
  </nav>
  <div class="fix-fill-content mb-4 px-4" v-if="isFiexd"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, onMounted, onUnmounted, ref } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserProps } from '../store'
import useCurrentInstance from '../hooks/globalProperties'
export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const isFiexd = ref(false)

    const { globalProperties } = useCurrentInstance()
    const store = globalProperties.$store
    const router = globalProperties.$router

    const logout = () => {
      store.commit('logout')
      router.push('/')
    }
    const windowScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      console.log('滚动的距离---', scrollTop)
      if (scrollTop > 0) {
        isFiexd.value = true
      } else {
        isFiexd.value = false
      }
    }
    onMounted(() => {
      window.addEventListener('scroll', windowScroll)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', windowScroll)
    })
    return {
      logout,
      isFiexd
    }
  }
})
</script>
<style scoped>
.nav-link{
  padding:.5rem .3rem
}
.box-shadow{
  box-shadow: 0 1px 3px rgb(18 18 18 / 10%)
}
.fiexed {
  position: fixed;
  top:0px;
  left:0px;
  right:0px;
  z-index:999
}
.fix-fill-content {
  height:52px;
  width:100%;
  visibility: hidden;
}
</style>
