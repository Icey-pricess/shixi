<template>
  <div class="create-post-page">
    <!-- <h4>{{isEdit?'编辑文章':'新建文章'}}</h4> -->
    <upload
      action="/upload"
      :beforeUpload="beforeUpload"
      :uploadedData="uploadedData"
      @file-uploaded-success="hanldeUploadSuccess"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      >
      <template #uploaded="slotProps">
        <div class="uploaded-area">
          <img :src="slotProps.uploadedData.data.url"/>
          <h3>点击重新上传</h3>
        </div>
       </template>
       <template #default>
         <h2>点击上传头图</h2>
       </template>
       <template #loading>
         <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only"></span>
          </div>
         </div>
       </template>
    </upload>
    <validate-form @form-submit="onformSubmit">
      <div class="mb-3">
        <validate-input
        :rules="titleRules"
        v-model="titleVal"
        placeholder="请输入文章标题"
        type="text"
        />
      </div>
      <div class="mb-3">
        <validate-input
        border
        tag="textarea"
        type="text"
        :rules="contentRules"
        v-model="contentVal"
        placeholder="请输入文章详情"
        rows="10"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEdit?'更新文章':'新建文章'}}</button>
      </template>
    </validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import ValidateInput, { RuleProps } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GolbalProps, PostProps, ResponeseProps, ImageProps } from '../store'
import Upload from '../components/Upload.vue'
import createMessage from '../components/createMessage'
import { beforeUploadCheck } from '../hooks/help'

const Rules1: RuleProps[] = [
  {
    type: 'required',
    message: '请输入文章标题'
  }
]
const Rules2: RuleProps[] = [
  {
    type: 'required',
    message: '请输入文章内容'
  }
]
export default defineComponent({
  name: 'CreatePost',
  components: { ValidateInput, ValidateForm, Upload },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const id = route.query.id
    const isEdit = !!id
    const store = useStore<GolbalProps>()
    const titleVal = ref('')
    const contentVal = ref('')
    const uploadedData = ref()
    const titleRules = Rules1
    const contentRules = Rules2
    const { column, _id } = store.state.user
    let imageId = ''
    onMounted(() => {
      if (isEdit) {
        store.dispatch('fetchCurrentPost', id).then((res:ResponeseProps<PostProps>) => {
          const { image, title, content } = res.data
          titleVal.value = title || ''
          contentVal.value = content || ''
          if (image) {
            uploadedData.value = { data: image }
          }
        })
      }
    })
    const onformSubmit = (val:string) => {
      console.log('onCreatePostSumbit', val)
      if (val) {
        if (column) {
          const newPost:PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column: column,
            image: imageId,
            author: _id
          }
          const actionName = isEdit ? 'updatePost' : 'createPost'
          const sendData = !isEdit ? newPost : {
            id: id,
            payload: newPost
          }
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功,2s后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'columnDetail', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const beforeUpload = (file:File) => {
      const res = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { error, passed } = res
      if (error === 'format') {
        createMessage('上传图片只能是JPG/PNG格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过1MB', 'error')
      }
      return passed
    }
    const hanldeUploadSuccess = (res:ResponeseProps<ImageProps>) => {
      createMessage(`上传图片ID ${res.data._id}`, 'success')
      if (res.data._id) {
        imageId = res.data._id
      }
    }
    return {
      titleVal,
      contentVal,
      onformSubmit,
      titleRules,
      contentRules,
      beforeUpload,
      hanldeUploadSuccess,
      uploadedData,
      isEdit
    }
  }
})
</script>
<style>
.create-post-page{
  padding:0 20px 20px;
}
.create-post-page .upload-box{
  height:200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .upload-box img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area{
  position: relative;
}
.uploaded-area:hover h3{
  display: block;
}
.uploaded-area h3{
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top:50%
}
</style>
