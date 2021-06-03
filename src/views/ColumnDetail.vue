<template>
  <div class="clomn-detail-page w-690">
    <div class="column-info row mb-4  pd-4 align-items-center" v-if="currentColumn">
      <div class="col-3 text-center" >
        <img :src="currentColumn.avatar&&currentColumn.avatar.fitUrl" class="rounded-circle border w-100"/>
      </div>
      <div class="col-9">
        <h4>{{currentColumn.title}}</h4>
        <p class="text-muted">{{currentColumn.description}}</p>
      </div>
    </div>
    <h6 class="clomn-split text-primary">文章列表</h6>
    <post-list :postlist="list"></post-list>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '../components/PostList.vue'
import { useStore } from 'vuex'
import { ColumnProps } from '../store'
import { addColumnAvatar } from '../hooks/help'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  name: 'ColumnDetail',
  components: { PostList },
  setup() {
    const route = useRoute()
    const store = useStore()
    const currentId = ref(route.params.id)
    onMounted(() => {
      if (currentId.value) {
        store.dispatch('fetchOneColumn', currentId.value)
        store.dispatch('fetchPosts', { cid: currentId.value })
      }
    })
    // 检测变化
    // watch(() => route.params, (toParams) => {
    //   if (toParams.id) {
    //     debugger
    //     store.dispatch('fetchOneColumn', toParams.id)
    //     store.dispatch('fetchPosts', { cid: toParams.id })
    //     currentId.value = toParams.id
    //   }
    // })
    const currentColumn = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId.value) as ColumnProps | undefined
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })
    const list = computed(() => store.getters.getPostsByCid(currentId.value))
    const count = computed(() => store.getters.getPostsCountByCid(currentId.value))
    const currentPage = computed(() => store.getters.getPostsCurrentPageByCid(currentId.value))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', count, { currentPage: currentPage.value, cid: currentId.value })
    return {
      currentColumn,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
<style scoped>
.w-690 {
  width: 690px;
  margin: 0 auto;
}
.clomn-split{
  height: 40px;
  line-height: 40px;
  background: #ebebeb;
}

</style>
