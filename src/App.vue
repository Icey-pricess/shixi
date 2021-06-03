<template>
  <div class="container">
    <global-header v-if="route.name!=='login' && route.name!=='signup'" :user="user"></global-header>
    <loader text="正在加载中..."  v-if="loading"></loader>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import { GolbalProps } from './store'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const store = useStore<GolbalProps>()
    const loading = computed(() => store.state.loading)
    const user = computed(() => store.state.user)
    const error = computed(() => store.state.error)
    const route = useRoute()
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    return {
      user,
      loading,
      error,
      route
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height: 100%;
}
.container{
  height: 100%;
  max-width: 100%;
  padding:0;
  margin:0
}
</style>
