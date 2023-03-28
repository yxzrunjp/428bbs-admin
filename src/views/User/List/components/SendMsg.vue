<template>
    <Dialog :width="'400px'" :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons">
        <el-form :model="formData" :label-width="60" :rules="rules" ref="formRef">
            <el-form-item :label="'消息'" prop="message">
                <el-input :autosize="{ minRows: 4 }" type="textarea" resize="none" placeholder="请输入所需发送的消息"
                    v-model="formData.message"></el-input>
            </el-form-item>
            <el-form-item :label="'积分'" prop="integral">
                <!-- <el-input-number v-model="formData.integral" /> -->
                <el-input v-model="formData.integral" /> 
                <!--  :min="0" -->
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue';
import { sendMessage } from '@/api/user.js'
const { proxy } = getCurrentInstance()
const dialogConfig = reactive({
    show: false,
    title: '发送系统消息',
    buttons: [
        {
            type: 'danger',
            text: '取消',
            click: () => {
                closeSendMsg()
            }
        },
        {
            type: 'primary',
            text: '发送',
            click: () => {
                formRef.value.validate(v => {
                    if (!v) {
                        return
                    }
                    // 提交信息
                    handleSubmit()
                })
            }
        },
    ],
})

const userId = ref('')
const formRef = ref(null)
const formData = reactive({
    message: '',
    integral: '',
    // integral: 0,
})
const rules = reactive({
    message: [
        { required: true, message: '请输入消息内容' },
    ]
})


const handleSubmit = () => {
    const params = {}
    Object.assign(params, formData)
    params.userId = userId.value
    submit(params)
}
const emit = defineEmits(['submit'])
const submit = async (params) => {
    const result = await sendMessage(params)
    if (!result) {
        return
    }
    proxy.Message.success('发送成功')
    closeSendMsg()
    emit('submit')
}


const showSendMsg = (data) => {
    userId.value = data.userId
    dialogConfig.show = true
}
const closeSendMsg = () => {
    formRef.value.resetFields()
    dialogConfig.show = false
}
defineExpose({
    showSendMsg
})
</script>

<style lang="scss" scoped>
.user-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .nickname {
        margin-left: 10px;
    }
}
</style>