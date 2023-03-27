<template>
    <Dialog :width="'400px'" :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons">
        <el-form :label-width="100">
            <el-form-item label="发布人">
                <div class="user-info">
                    <Avatar :link="false" :size="40" :userId="userId"></Avatar>
                    <div class="nickname">{{ nickName }}</div>
                </div>
            </el-form-item>
            <el-form-item label="文件名">
                {{ fileInfo.fileName }}
            </el-form-item>
            <el-form-item label="大小">
                {{ fileInfo.fileSize }}
            </el-form-item>
            <el-form-item label="下载所需积分">
                {{ fileInfo.integral }}
            </el-form-item>
            <el-form-item label="操作">
                <span class="text-btn" @click="handleDownload">下载</span>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { reactive, ref, inject } from 'vue';
import { getAttachment } from '@/api/article.js'
const globalInfo = inject('globalInfo')

const nickName = ref('')
const articleId = ref('')
const userId = ref('')
const dialogConfig = reactive({
    show: false,
    title: '附件信息',
    buttons: [
        {
            type: 'primary',
            text: '关闭',
            click: () => {
                closeFileInfo()
            }
        }
    ],
})

const fileInfo = reactive({
    fileId: '',//文件ID
    fileSize: '',//文件大小
    fileName: '',//文件名
    downloadCount: 0,//下载次数
    fileType: 0,//文件类型 0：压缩包
    integral: 0,//下载所需要的积分
})
// 获取附件信息
const getFileInfo = async () => {
    const result = await getAttachment({
        articleId: articleId.value
    })
    if (!result) {
        return
    }
    Object.assign(fileInfo, result.data)
}

const handleDownload = () => {
    window.open(`${globalInfo.attachmentDownloadUrl}?fileId=${fileInfo.fileId}`,'_blank')
}

const showFileInfo = (data) => {
    nickName.value = data.nickName
    articleId.value = data.articleId
    userId.value = data.userId
    dialogConfig.show = true
    getFileInfo()
}
const closeFileInfo = () => {
    dialogConfig.show = false
}
defineExpose({
    showFileInfo
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