<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card border-bottom">
      <div class="card-body">
        <h4 class="text-align-left"><router-link :to="`/postDetail/${post._id}`">{{post.title}}</router-link></h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image&&post.image.url" class="col-4">
            <img :src="post.image.url" alt="post.title" class="rounded-lg w-100"/>
          </div>
          <p :class="{'col-8':post.image.url}" class="text-muted">{{post.excerpt}}</p>
        </div>
        <span class="text-muted">{{post.createdAt}}</span>
      </div>
    </article>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PostProps, ImageProps } from '../store'
import { generateFitUrl } from '../hooks/help'
export default defineComponent({
  name: 'PostList',
  props: {
    postlist: {
      type: Array as PropType<PostProps[]>,
      required: true
    }
  },
  setup (props) {
    const posts = computed(() => {
      return props.postlist.map(post => {
        generateFitUrl(post.image as ImageProps, 200, 110, ['m_fill'])
        return post
      })
    })
    return {
      posts
    }
  }
})
</script>
<style scoped>
.card {
  border:none;
}
.text-align-left{
  text-align: left;
}
.text-align-right{
  text-align: right;
}
</style>
