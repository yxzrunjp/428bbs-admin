<template>
    <div class="login-body">
        <div class="login-body-height">
            <div class="login-panel">
                <h2 class="login-title">用户登录</h2>
                <el-form :model="formData" :rules="rules" ref="formDataRef">
                    <el-form-item prop="account" label="">
                        <el-input placeholder="请输入账号" v-model="formData.account">
                            <template #prefix>
                                <i class="iconfont icon-account"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password" label="">
                        <el-input type="password" placeholder="请输入密码" v-model="formData.password">
                            <template #prefix>
                                <i class="iconfont icon-password"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="checkCode" class="checkcode-item" label="">
                        <el-input placeholder="请输入验证码" v-model="formData.checkCode">
                            <template #prefix>
                                <i class="iconfont icon-checkcode"></i>
                            </template>
                        </el-input>
                        <div class="img-wrap" @click="changeCheckCode">
                            <img :src="checkCodeUrl" alt="验证码">
                        </div>
                    </el-form-item>

                    <el-form-item label="">
                        <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button @click="handleLogin" type="primary" :style="{ width: '100%' }">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onUnmounted, onMounted } from 'vue';
import md5 from 'js-md5'
import { useRouter } from 'vue-router'
import { login } from '@/api/login.js'
const router = useRouter()
const { proxy } = getCurrentInstance()
const api = {
    checkCode: '/api/checkCode',
}

// 表单相关
const formData = reactive({
    account: '',
    password: '',
    checkCode: '',
    rememberMe: false,
})
const formDataRef = ref(null)
const rules = {
    account: [{ required: true, message: "请输入用户名" }],
    password: [{ required: true, message: "请输入密码" }],
    checkCode: [{ required: true, message: "请输入验证码" }]
}

// 获取用户登录信息
const init = () => {
    const loginInfo = proxy.VueCookies.get('loginInfo');
    if (loginInfo) {
        Object.assign(formData, loginInfo);
    }
}
init()

// 验证码相关
const checkCodeUrl = ref(api.checkCode)
const changeCheckCode = () => {
    checkCodeUrl.value = api.checkCode + `?${Date.now()}`
}
// 登录事件
const handleLogin = () => {
    formDataRef.value.validate(async valid => {
        if (!valid) {
            return
        } else {
            // 获取已存在的登录信息
            const cookiesInfo = proxy.VueCookies.get('loginInfo')
            const cpwd = cookiesInfo ? cookiesInfo.password : null
            // 当前输入的密码和登录信息用的密码（已加密）不相同，则进行加密
            if (formData.password !== cpwd) {
                formData.password = md5(formData.password)
            }
            const params = {
                account: formData.account,
                password: formData.password,
                checkCode: formData.checkCode,
            }
            const result = await login(params)
            if (!result) {
                formData.checkCode = ''
                formData.password = ''
                changeCheckCode()
                return
            }
            const loginInfo = {
                account: params.account,
                password: params.password,
                rememberMe: formData.rememberMe,
            }
            proxy.VueCookies.set("userInfo", result.data, 0)//用户信息永不过期
            if (formData.rememberMe) {
                // 保存登录信息
                proxy.VueCookies.set("loginInfo", loginInfo, '7d')
            } else {
                proxy.VueCookies.remove('loginInfo')
            }
            proxy.Message.success('登录成功')
            changeCheckCode()

            setTimeout(() => {
                router.replace('/')
            }, 1500)
        }
    })
}

const enterKeyDownEvent = (e) => {
    if (e.key === 'Enter') {
        handleLogin()
    }
}

// 按下enter
onMounted(() => {
    document.addEventListener('keydown', enterKeyDownEvent)
})
onUnmounted(() => {
    document.removeEventListener('keydown', enterKeyDownEvent)
})
</script>

<style lang="scss" scoped>
.login-body {
    width: 100%;
    height: 100vh;
    background-image: url('@/assets/img/login-bg-blur.jpg');
    background-size: cover;
    background-position: center;

    .login-body-height {
        width: 100%;
        height: 100%;
        background-image: url('@/assets/img/login-bg.jpg');
        background-size: cover;
        background-position: center;
        position: relative;

        .login-panel {
            position: absolute;
            right: 60px;
            top: 200px;
            width: 350px;
            padding: 10px 20px 0px;
            border-radius: 10px;
            background-color: rgba($color: #fff, $alpha: .7);
            box-shadow: 10px 10px 8px rgba(#000, .3);
            font-size: 16px;

            .login-title {
                font-size: 20px;
                text-align: center;
                margin-bottom: 10px;
            }

            .checkcode-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .img-wrap {
                    font-size: 0;
                    width: 100px;
                    height: 30px;
                    margin-left: 20px;
                    cursor: pointer;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }


                .el-input {
                    flex: 1;
                }
            }
        }
    }


}
</style>