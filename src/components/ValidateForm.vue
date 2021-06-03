<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
        <button type="submit" class="btn btn-primary" @click.prevent="clearForm">重置</button>
      </slot>
    </div>
  </form>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
export const emitter = mitt()
type ValidateFunc=() => boolean
type ClearFunc=()=>void

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit', 'form-clear'],
  setup (props, ctx) {
    let funcArr:ValidateFunc[] = []
    let clearArr:ClearFunc[] = []
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(item => item)
      ctx.emit('form-submit', result)
    }
    const clearForm = () => {
      clearArr.map(func => func())
      ctx.emit('form-clear')
    }
    const callback = (func?:ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }
    const clearcallback = (func?:ClearFunc) => {
      if (func) {
        clearArr.push(func)
      }
    }
    emitter.on('form-item-created', callback)
    emitter.on('form-item-clear', clearcallback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      emitter.off('form-item-clear', clearcallback)
      funcArr = []
      clearArr = []
    })
    return {
      submitForm,
      clearForm
    }
  }
})
</script>
