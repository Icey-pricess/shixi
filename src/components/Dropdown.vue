<template>
  <div class="dropdown" ref="dropdownRef" v-click-outside:[dropdownRef]="handletest">
   <a href="#" class="btn btn-outline-light my-2 dropdown-toggle text-primary" @click.prevent="toggleOpen">
    {{title}}
   </a>
    <ul class="dropdown-menu" v-if="isOpen" style="display:block" >
      <slot name="dropdown"></slot>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
// import useClikOutSide from '../hooks/useClickOutside'
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup() {
    const isOpen = ref(false)
    const dropdownRef = ref < null | HTMLElement >(null)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    // const isClikOutside = useClikOutSide(dropdownRef)
    // watch(isClikOutside, () => {
    //   if (isOpen.value && isClikOutside.value) {
    //     isOpen.value = false
    //   }
    // })
    const handletest = () => {
      console.log('clickoutside---点击了外部')
      if (isOpen.value) {
        isOpen.value = false
      }
    }
    return {
      isOpen,
      toggleOpen,
      dropdownRef,
      handletest
    }
  }
})
</script>
<style scoped>
.dropdown-menu{
  min-width: unset;
}
</style>
