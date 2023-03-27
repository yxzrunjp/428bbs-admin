<template>
    <Dialog :width="'400px'" :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons">
        <el-form :model="formData" ref="formRef">
            <el-form-item :label="'标题'">
                {{ articleTitle }}
            </el-form-item>
            <el-form-item :label="'板块'">
                <el-cascader placeholder="请选择板块" :props="boardProps" v-model="formData.boardInfo" :options="boardList" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { updateBoard } from '@/api/article.js'
const prop = defineProps({
    boardList: {
        type: Array,
        default: () => {
            return []
        }
    },
    boardProps: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const emit = defineEmits(['updateSuccess'])
const articleTitle = ref('')

const formRef = ref(null)
const formData = reactive({
    articleId: '',
    boardInfo: null,
})

const dialogConfig = reactive({
    show: false,
    title: '修改板块',
    buttons: [
        {
            type: 'danger',
            text: '取消',
            click: () => {
                closeUpdateDialog()
            }
        },
        {
            type: 'primary',
            text: '修改',
            click: () => {
                handleSubmit()
            }
        },

    ],
})

const handleSubmit = () => {
    // 处理参数
    const params = {}
    Object.assign(params, formData)
    if (params.boardInfo) {
        params.pBoardId = params.boardInfo[0]
        params.boardInfo[1] && (params.boardId = params.boardInfo[1])
    }
    delete params.boardInfo
    update(params)
}

const update = async (params) => {
    const result = await updateBoard(params)
    if (!result) {
        return
    }
    // 关闭弹窗
    closeUpdateDialog()
    // 通知父组件更新完成
    emit('updateSuccess')
}


const showUpdateDialog = (data) => {
    formData.articleId = data.articleId

    formData.boardInfo = [data.pBoardId]
    data.boardId && formData.boardInfo.push(data.boardId)

    articleTitle.value = data.title
    dialogConfig.show = true
}
const closeUpdateDialog = () => {
    dialogConfig.show = false
}
defineExpose({
    showUpdateDialog
})
</script>

<style lang="scss" scoped></style>