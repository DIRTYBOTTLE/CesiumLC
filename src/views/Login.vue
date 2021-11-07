<template>
  <div class="login-box">
    <!-- 登录卡片 -->
    <div class="login-card">
      <h3>湖北省水利水电数据管理系统</h3>
      <a-divider style="height: 1px; background-color: #eeeeee" />
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户名" v-bind="validateInfos.username">
          <a-input v-model:value="modelRef.username" />
        </a-form-item>
        <a-form-item label="密码" v-bind="validateInfos.password">
          <a-input type="password" v-model:value="modelRef.password" />
        </a-form-item>
        <a-form-item label="角色" v-bind="validateInfos.usertype">
          <a-select
            v-model:value="modelRef.usertype"
            placeholder="请选择您的身份类型"
          >
            <a-select-option value="administrator">管理员</a-select-option>
            <a-select-option value="user">用户</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="10">
              <a-button type="primary" @click.prevent="login">登录</a-button>
            </a-col>
            <a-col :span="10">
              <a-button style="margin-left: 10px" @click="register"
                >注册</a-button
              >
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRaw } from "vue"
import { Form, message } from "ant-design-vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import axios from "axios"
import Cookies from 'js-cookie'
const useForm = Form.useForm

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()

    const modelRef = reactive({
      username: "",
      password: "",
      usertype: undefined,
    })
    const rulesRef = reactive({
      username: [
        {
          required: true,
          message: "请输入用户名!",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码!",
        },
      ],
      usertype: [
        {
          required: true,
          message: "请选择您的身份类型",
        },
      ],
    })
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)

    const login = () => {
      validate()
        .then(() => {
          const url = store.state.baseUrl + "/login"
          const userInfo = toRaw(modelRef)
          // const res = await axios.post(url, userInfo)
					router.push("/home").catch((err) => {
						console.log(err)
					})
          // if (res.status === 200) {
          //   if (res.data[0].count === "1") {
          //     Cookies.set('username', userInfo.username, { expires: 1 })
          //     Cookies.set('usertype', userInfo.usertype, { expires: 1 })
          //     router.push("/home").catch((err) => {
          //       console.log(err)
          //     })
          //   }
          // } else {
          //   message.error("登录失败，请确认信息输入是否有误")
          // }
        })
        .catch((err) => {
          message.error("登录失败，请确认信息输入是否有误")
        })
    }

    const register = () => {}

    return {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
      validateInfos,
      resetFields,
      modelRef,
      login,
      register,
    }
  },
})
</script>

<style scoped>
body {
  width: 100%;
  height: 100%;
}

.login-box {
  height: 100%;
  background: url("assets/bgc.jpg");
}

.login-card {
  width: 420px;
  height: 360px;
  position: absolute;
  left: 55%;
  top: 50%;
  transform: translate(0, -50%);
  background-color: #ffffff;
  padding: 20px;
}

h3 {
  text-align: center;
  font-weight: bold;
}

.ant-btn {
  width: 100%;
  height: 100%;
}
</style>
