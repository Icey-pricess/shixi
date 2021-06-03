<template>
  <div class="login-page mx-auto">
    <div class="d-flex justify-content-center align-items-center full">
      <div>
        <h5 class="text-center fs-60 fw-bold text-primary">时习</h5>
        <p class="mb-5 fs-6">学而时习之 不亦悦乎</p>
        <div class="login-content">
          <div class="login-content-title fs-4 mb-5">密码登录</div>
          <validate-form @form-submit="handleSubmit">
            <div class="mb-3 validate-form-item">
              <validate-input v-model="inputVal" :rules="emailrules" type="text" placeholder="请输入邮箱"></validate-input>
            </div>
            <div class="mb-3 validate-form-item">
              <validate-input v-model="passwordVal" :rules="passwordrules" type="password" placeholder="请输入密码"></validate-input>
              <div class="form-text text-right">
                <router-link to="/signup">还没有账户？去注册一个新的吧</router-link>
              </div>
            </div>
            <template v-slot:submit>
              <button type="submit" class="btn btn-primary btn-block btn-large login-btn">进入时习</button>
            </template>
          </validate-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RuleProps } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../components/createMessage'
import useCurrentInstance from '../hooks/globalProperties'
import { useStore } from 'vuex'
const RuleData: RuleProps[] = [
  {
    type: 'required',
    message: '请输入邮箱'
  }, {
    type: 'email',
    message: '邮箱格式不正确'
  }
]
const RuleData2:RuleProps[] = [
  {
    type: 'required',
    message: '请输入密码'
  }, {
    type: 'range',
    min: { message: '不能少于3个字符', length: 3 },
    max: { message: '不能大于9个字符', length: 9 }
  }
]
export default defineComponent({
  name: 'Login',
  components: { ValidateInput, ValidateForm },
  setup() {
    const { globalProperties } = useCurrentInstance()
    const store = useStore()
    const router = globalProperties.$router

    const emailrules = RuleData
    const inputVal = ref('')

    const passwordrules = RuleData2
    const passwordVal = ref('')
    // eslint-disable-next-line no-trailing-spaces

    const handleSubmit = (val:boolean) => {
      console.log('提交成功', val)
      if (val) {
        const loginData = {
          email: inputVal.value,
          password: passwordVal.value
        }
        store.dispatch('loginAndFetch', loginData).then(() => {
          createMessage('登录成功，2s后跳转首页', 'success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }).catch((error:Error) => {
          console.log('qingqiucuowu', error)
        })
      }
    }
    return {
      emailrules,
      inputVal,
      passwordrules,
      passwordVal,
      handleSubmit
    }
  }
})
</script>
<style scoped>
.login-page{
  background-image: url('../assets/海豚表演.svg');
  background-repeat: no-repeat;
  background-color: #b8e5f8;
  background-size: cover;
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 30px 10px;
}
.login-content{
    box-sizing: border-box;
    min-width: 0;
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
    border-radius: 6px;
    background-color: #FFFFFF;
    width: 400px;
    height:350px;
    overflow: hidden;
    padding:30px 20px;
    position: relative;
}
.form-text{
  margin-top:30px;
  text-align: right;
  position: absolute;
  bottom:84px;
  right:20px;
}
.login-btn{
  position: absolute;
  bottom:40px;
  left:20px;
  right:20px;
  width:calc(100% - 40px)
}

</style>
