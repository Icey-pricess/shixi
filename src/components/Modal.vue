<template>
  <teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="isVisible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="onClose">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"  @click="onClose">取消</button>
            <button type="button" class="btn btn-primary"  @click="onConfirm">确定</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '../hooks/useDOMCreate'
export default defineComponent({
  name: 'Modal',
  emits: ['model-close', 'model-confirm'],
  props: {
    title: {
      type: String,
      default: ''
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    useDOMCreate('modal')
    const onClose = () => {
      ctx.emit('model-close')
    }
    const onConfirm = () => {
      ctx.emit('model-confirm')
    }
    return {
      onClose,
      onConfirm
    }
  }
})
</script>
