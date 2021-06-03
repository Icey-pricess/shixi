<template>
  <div class="rowpage">
    <div v-for="column in newList" :key="column._id" class="container">
      <div class="row py-4">
        <div class="col-4">
          <div class="flex-column d-flex align-items-center point-cursor" @click="goToDetail(column._id)">
            <img :src="column.avatar && column.avatar.url" class="rounded-circle border border-light w-25 " />
            <span class="text-primary ">{{column.title}}</span>
          </div>
        </div>
        <div class="col-6 d-flex align-items-center">
          <span>{{column.description}}</span>
        </div>
      </div>
    </div>
  </div>

</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ColumnProps } from '../store'
import { addColumnAvatar } from '../hooks/help'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const newList = computed(() => {
      return props.list.map((item) => {
        addColumnAvatar(item, 50, 50)
        return item
      })
    })
    const goToDetail = (id:string) => {
      router.push({
        name: 'columnDetail',
        params: { id }
      })
    }

    return {
      newList,
      goToDetail
    }
  }
})
</script>
<style scoped>
.container:not(:last-child){
  border-bottom:1px solid #ebebeb
}
.point-cursor{
  cursor: pointer;
}
</style>
