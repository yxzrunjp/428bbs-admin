<template>
    <Dialog :width="'500px'" :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons">
        <el-form :label-width="80" :model="formData" ref="formRef" :rules="rules">
            <el-form-item v-if="pBoardName" label="一级板块">{{ pBoardName }}</el-form-item>
            <el-form-item label="板块名称" prop="boardName">
                <el-input v-model="formData.boardName" placeholder="请输入板块名称"></el-input>
            </el-form-item>
            <el-form-item label="发帖权限" prop="postType">
                <el-radio-group v-model="formData.postType">
                    <el-radio :label="1">{{ postType[1] }}</el-radio>
                    <el-radio :label="0">{{ postType[0] }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="封面" prop="cover">
                <UploadImg v-model="formData.cover" @upload="uploadFinish">
                    <div class="img-wrap">
                        <Cover v-if="src" :url="src" :style="{ width: '100%', height: '100%' }" />
                        <i v-else class="iconfont icon-add"></i>
                    </div>
                </UploadImg>
            </el-form-item>
            <el-form-item label="简介" prop="boardDesc">
                <el-input resize="none" :autosize="{ minRows: 4 }" type="textarea" placeholder="请输入简介"
                    v-model="formData.boardDesc"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { reactive, ref, inject, getCurrentInstance } from 'vue';
import UploadImg from '@/components/UploadImg.vue'
import { saveBoard } from '@/api/board.js'
const { proxy } = getCurrentInstance()
const postType = inject('postType')
const globalInfo = inject('globalInfo')

const formRef = ref(null)
const pBoardName = ref('')
const formData = reactive({
    boardId: null,//板块ID 修改时必传
    pBoardId: null,//父级板块ID
    boardName: '',//板块名称
    boardDesc: '',//板块描述
    cover: null,//封面，文件流
    postType: 1,//是否可以发帖
})
const rules = reactive({
    postType: [{ required: true, message: '请选择发帖权限' }],
    boardName: [{ required: true, message: '请输入板块名称' }],
})
const emit = defineEmits(['finish'])
const dialogConfig = reactive({
    show: false,
    title: '',
    buttons: [
        {
            type: 'danger',
            text: '取消',
            click: () => {
                formRef.value.resetFields()
                src.value = ''
                pBoardName.value = ''
                closeEditBoard()
            }
        },
        {
            type: 'primary',
            text: '确定',
            click: () => {
                formRef.value.validate(async v => {
                    if (!v) {
                        return
                    }
                    await handleSubmit()

                    emit('finish', !!pBoardName.value)
                    formRef.value.resetFields()
                    src.value = ''
                    pBoardName.value = ''
                    closeEditBoard()
                })

            }
        },
    ],
})

const src = ref('')
const uploadFinish = (file, url) => {
    src.value = url
}
const handleSubmit = async () => {
    // 处理参数
    const params = {}
    Object.assign(params, formData)
    if (!params.boardId) {
        delete params.boardId
    }
    const result = await saveBoard(params)
    if (!result) {
        return
    }
    proxy.Message.success('保存成功')
}


const showEditBoard = ({ row, dialogTitle, pBoardName: pName }) => {
    for (const key in formData) {
        if (key === 'cover') {
            src.value = row.cover ? `${globalInfo}/${row.cover}` : '';
            continue
        }
        if (key === 'postType') {
            formData[key] = row[key] === 0 ? 0 : 1
            continue
        }
        formData[key] = row[key]
    }

    dialogConfig.title = dialogTitle
    pBoardName.value = pName

    dialogConfig.show = true
}
const closeEditBoard = () => {
    dialogConfig.show = false
}
defineExpose({
    showEditBoard
})
</script>

<style lang="scss" scoped>
.img-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 100px;
    background-color: #ddd;
    font-size: 0;

    i {
        font-size: 40px;
    }
}
</style>