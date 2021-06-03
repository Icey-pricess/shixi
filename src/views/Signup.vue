<template>
  <div class="singup-page mx-auto">
    <div class="d-flex justify-content-center align-items-center full">
      <div class="singup-content">
        <h5 class="text-center fs-60 fw-bold text-primary">时习</h5>
        <p class="mb-4 fs-6 text-primary">注册时习，发现更大的世界</p>
        <validate-form @form-submit="handleSubmit">
          <div class="mb-3 validate-form-item">
            <validate-input
              :rules="emailRules"
              v-model="formData.email"
              placeholder="请输入邮箱地址"
              type="text"
            ></validate-input>
          </div>
          <div class="mb-3 validate-form-item">
            <validate-input
              :rules="nameRules"
              v-model="formData.nickName"
              placeholder="请输入昵称"
              type="text"
            ></validate-input>
          </div>
          <div class="mb-3 validate-form-item">
            <validate-input
              :rules="passwordRules"
              v-model="formData.password"
              placeholder="请输入密码"
              type="password"
            ></validate-input>
          </div>
          <div class="mb-3 validate-form-item">
            <validate-input
              :rules="rePasswordRules"
              v-model="formData.repeatPassword"
              placeholder="请再次输入密码"
              type="password"
            ></validate-input>
          </div>
          <template #submit>
            <button type="submit" class="btn btn-primary btn-block btn-large sigup-btn">注册新用户</button>
          </template>
        </validate-form>
        <div class="singup-content-bottom">已有账号?<router-link class="text-primary" to="/login">登录</router-link></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RuleProps } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
import useCurrentInstance from '../hooks/globalProperties'

export default defineComponent({
  name: 'Signup',
  components: { ValidateForm, ValidateInput },
  setup() {
    const { globalProperties } = useCurrentInstance()
    const router = globalProperties.$router
    const axios = globalProperties.$axios

    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })

    const emailRules:RuleProps[] = [{ type: 'required', message: '请输入邮箱地址' }, { type: 'email', message: '邮箱格式不正确' }]
    const nameRules:RuleProps[] = [{ type: 'required', message: '请输入昵称' }]
    const passwordRules:RuleProps[] = [{ type: 'required', message: '请输入密码' }]
    const rePasswordRules:RuleProps[] = [{ type: 'required', message: '请再次输入密码' }, { type: 'custom', validator: () => { return formData.password === formData.repeatPassword }, message: '两次密码不一致' }]

    const handleSubmit = (val:boolean) => {
      if (val) {
        const data = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        axios.post('/users', data).then(() => {
          createMessage('注册成功', 'success')
          router.push('/login')
        }).catch((error:Error) => {
          console.log('注册出错', error)
        })
      }
    }

    return {
      formData,
      emailRules,
      nameRules,
      passwordRules,
      rePasswordRules,
      handleSubmit
    }
  }
})
</script>
<style scoped>
.singup-page{
  background-image: url(https://static.zhihu.com/heifetz/assets/sign_bg.db29b0fb.png);
  background-repeat: no-repeat;
  background-color: #b8e5f8;
  background-size: cover;
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 30px 10px;
}
.singup-content{
  background-color: #FFFFFF;
  box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
  border-radius: 6px;
  background-color: #FFFFFF;
  width: 400px;
  height:550px;
  overflow: hidden;
  padding:30px 20px;
  position: relative;
}
.sigup-btn {
  position: absolute;
  bottom:54px;
  left:20px;
  right:20px;
  width:calc(100% - 40px)
}
.singup-content-bottom{
  position: absolute;
  bottom:30px;
  right:20px;
  font-size:14px;
}
</style>
