<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag!=='textarea'"
      v-bind="$attrs"
      class="form-control"
      :class="{'is-invalid': inputRef.isError}"
      v-model="inputRef.val"
      @blur="valideInput"
    >
    <textarea
      v-else
      v-bind="$attrs"
      class="form-control"
      :class="{'is-invalid': inputRef.isError}"
      v-model="inputRef.val"
      @blur="valideInput"
    >
    </textarea>
    <span v-show="inputRef.isError" class="invalid-feedback">{{inputRef.message}}</span>
  </div>

</template>
<script lang="ts">
import { defineComponent, PropType, reactive, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export interface RuleProps{
  type:'required' | 'email' | 'range' | 'custom',
  message?:string,
  min?:{message:string, length:number},
  max?:{message:string, length:number},
  validator?:()=>boolean
}
type tagProps = 'input' | 'textarea'
export default defineComponent({
  name: 'ValidateInput',
  inheritAttrs: false,
  props: {
    rules: {
      type: Array as PropType<RuleProps[]>
    },
    tag: {
      type: String as PropType<tagProps>,
      default: 'input'
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup (props, ctx) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue,
        set: (val) => ctx.emit('update:modelValue', val)
      }),
      isError: false,
      message: ''
    })
    const valideInput = () => {
      if (props.rules) {
        const allpass = props.rules.every(rule => {
          let pass = true
          inputRef.message = rule.message || ''
          switch (rule.type) {
            case 'required' :
              pass = (inputRef.val.trim() !== '')
              break
            case 'email' :
              pass = emailReg.test(inputRef.val)
              break
            case 'range' :
              // eslint-disable-next-line no-case-declarations
              const { min, max } = rule
              if (min && min.length > inputRef.val.trim().length) {
                pass = false
                inputRef.message = min.message
              }
              if (max && max.length < inputRef.val.trim().length) {
                pass = false
                inputRef.message = max.message
              }
              break
            case 'custom':
              pass = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return pass
        })
        inputRef.isError = !allpass
        return allpass
      } else {
        return true
      }
    }
    const clearInputs = () => {
      inputRef.val = ''
    }

    onMounted(() => {
      emitter.emit('form-item-created', valideInput)
      emitter.emit('form-item-clear', clearInputs)
    })

    return {
      inputRef,
      valideInput
    }
  }
})
</script>
<style>

</style>
