<template>
    <div class="sys">
        <div class="form">
            <el-form :model="formData" :rules="rules" ref="formRef">

                <el-divider content-position="left">用户注册欢迎消息</el-divider>
                <el-form-item prop="registerWelcomInfo" :label="'欢迎消息'">
                    <el-input placeholder="请输入欢迎消息" v-model="formData.registerWelcomInfo"></el-input>
                </el-form-item>

                <el-divider content-position="left">邮件设置</el-divider>
                <el-form-item prop="emailTitle" :label="'邮件标题'">
                    <el-input placeholder="请输入邮件标题" v-model="formData.emailTitle"></el-input>
                </el-form-item>
                <el-form-item prop="emailContent" :label="'邮件内容'">
                    <el-input placeholder="请输入邮件内容" v-model="formData.emailContent"></el-input>
                </el-form-item>

                <el-divider content-position="left">审核设置</el-divider>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="postAudit" :label="'帖子是否需要审核'">
                            <el-radio-group v-model="formData.postAudit">
                                <el-radio :label="false" size="large">无需审核</el-radio>
                                <el-radio :label="true" size="large">需要审核</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="commentAudit" :label="'评论是否需要审核'">
                            <el-radio-group v-model="formData.commentAudit">
                                <el-radio :label="false" size="large">无需审核</el-radio>
                                <el-radio :label="true" size="large">需要审核</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">发帖设置</el-divider>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item :label-width="130" prop="postIntegral" :label="'发帖积分'">
                            <el-input-number :min="0" placeholder="请输入发帖积分"
                                v-model="formData.postIntegral"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label-width="150" prop="dayImageUploadCount" :label="'每天可上传图片数量'">
                            <el-input-number :min="0" placeholder="请输入每天可上传图片数量"
                                v-model="formData.dayImageUploadCount"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item :label-width="130" prop="postDayCountThreshold" :label="'每天可发帖数量'">
                            <el-input-number :min="0" placeholder="请输入每天可发帖数量"
                                v-model="formData.postDayCountThreshold"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label-width="150" prop="attachmentSize" :label="'允许附件大小(MB)'">
                            <el-input-number :min="0" placeholder="请输入允许附件大小(MB)"
                                v-model="formData.attachmentSize"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">评论设置</el-divider>
                <el-form-item prop="commentOpen" :label="'是否开启评论'">
                    <el-radio-group v-model="formData.commentOpen">
                        <el-radio :label="true" size="large">开启</el-radio>
                        <el-radio :label="false" size="large">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item prop="commentIntegral" :label="'评论积分'">
                            <el-input-number :min="0" placeholder="请输入评论积分"
                                v-model="formData.commentIntegral"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="commentDayCountThreshold" :label="'每天可发评论数量'">
                            <el-input-number :min="0" placeholder="请输入每天可发评论数量"
                                v-model="formData.commentDayCountThreshold"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">点赞设置</el-divider>
                <el-form-item prop="likeDayCountThreshold" :label="'每天可点赞数量'">
                    <el-input-number :min="0" placeholder="请输入点赞数量"
                        v-model="formData.likeDayCountThreshold"></el-input-number>
                </el-form-item>
                <div class="button-wrap">
                    <el-button type="primary" @click="handleSave">保存</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { getSetting, saveSetting } from '@/api/setting.js'
const { proxy } = getCurrentInstance()
const formRef = ref(null)
const formData = reactive({
    registerWelcomInfo: '',//用户注册欢迎消息

    emailTitle: '',//邮件标题
    emailContent: '',//邮件内容

    postAudit: false,//帖子是否需要审核
    commentAudit: false,//评论是否需要审核

    postIntegral: 1,//发帖积分
    dayImageUploadCount: 50,//每天可上传图片数量
    postDayCountThreshold: 50,//每天可发贴数量
    attachmentSize: 1,//允许附件大小

    commentOpen: true,//是否开启评论
    commentIntegral: 1,//评论积分
    commentDayCountThreshold: 50,//每天可发评论数量

    likeDayCountThreshold: 50,//每天可点赞数量
})
const rules = reactive({
    registerWelcomInfo: [
        { required: true, message: '请输入用户注册欢迎消息' }
    ],
    emailTitle: [
        { required: true, message: '请输入邮件标题' }
    ],
    emailContent: [
        { required: true, message: '请输入邮件内容' }
    ],
    postAudit: [
        { required: true, message: '请选择帖子是否需要审核' }
    ],
    commentAudit: [
        { required: true, message: '请选择评论是否需要审核' }
    ],
    postIntegral: [
        { required: true, message: '请输入发帖积分' }
    ],
    dayImageUploadCount: [
        { required: true, message: '请输入每天可上传图片数量' }
    ],
    postDayCountThreshold: [
        { required: true, message: '请输入每天可发贴数量' }
    ],
    attachmentSize: [
        { required: true, message: '请输入附件大小限制' }
    ],
    commentOpen: [
        { required: true, message: '请选择是否开启评论' }
    ],
    commentIntegral: [
        { required: true, message: '请输入评论可获得的积分' }
    ],
    commentDayCountThreshold: [
        { required: true, message: '请输入每天可评论数量' }
    ],
    likeDayCountThreshold: [
        { required: true, message: '请输入每天可点赞数量' }
    ],
})
const handleSave = () => {
    formRef.value.validate(v => {
        if (!v) {
            return
        }
        save()
    })
}
const save = async () => {
    const params = {}
    Object.assign(params, formData)
    const result = await saveSetting(params)
    if (!result) {
        return
    }
    proxy.Message.success('保存成功!')
    getSysSetting()
}

const getSysSetting = async () => {
    const result = await getSetting()
    if (!result) {
        return
    }
    const data = {}
    for (const key in result.data) {
        Object.assign(data, {
            ...result.data[key]
        })
    }
    Object.assign(formData, data)
}
const init = async () => {
    await getSysSetting()
}
init()
</script>

<style lang="scss" scoped>
.sys {
    .form {
        width: 66%;

        .el-form-item {
            margin-bottom: 14px;
        }

        .el-col {
            .el-form-item {
                align-items: center;
            }
        }

        .button-wrap {
            // margin-top: 20px;
            text-align: center;
        }
    }
}
</style>