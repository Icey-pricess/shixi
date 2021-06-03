<template>
<div class="home-page container-md">
  <section class="text-center container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto">
        <img src="../assets/work.svg" alt="callout" class="w-50"/>
        <h2 class="font-weight-light">随心写作，自由表达</h2>
        <p>
          <a class="btn btn-primary my-2" @click="createOrLogin">开始写文章</a>
        </p>
      </div>
    </div>
  </section>
  <section class="card ">
    <div class="card-title">
      <h6 class="card-tab text-primary">发现精彩</h6>
    </div>
    <div class="card-body">
      <column-list :list="list"></column-list>
      <button class="btn btn-outline-primary mt-4 mb-3 mx-auto btn-block w-25" @click="loadMorePage" v-if="!isLastPage">
        加载更多
      </button>
    </div>
  </section>
</div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import { useStore } from 'vuex'
import useLoadMore from '../hooks/useLoadMore'
import { useRouter } from 'vue-router'
import { objectToArray } from '../hooks/help'
export default defineComponent({
  name: 'Home',
  components: { ColumnList },
  setup() {
    const store = useStore()
    const router = useRouter()
    const totalColumns = computed(() => store.state.columns.total || 0)
    const currentPage = computed(() => store.state.columns.currentPage || 0)
    onMounted(() => {
      store.dispatch('fetchColumn')
    })
    const list = computed(() => objectToArray(store.state.columns.data))
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumn', totalColumns, { currentPage: currentPage.value }, 6)

    const createOrLogin = () => {
      const isLogin = store.state.user.isLogin
      if (!isLogin) {
        router.push('/login')
      } else {
        router.push('/createPost')
      }
    }
    return {
      list,
      loadMorePage,
      isLastPage,
      totalColumns,
      createOrLogin
    }
  }
})
</script>
<style scoped>
.card-tab{
  text-align: left;
  font-weight: 500;
  padding: 16px;
  border-bottom:1px solid #ebebeb;
  background:#ebebeb

}
.card{
  border:none
}
.card-body{
  padding:0
}
</style>
