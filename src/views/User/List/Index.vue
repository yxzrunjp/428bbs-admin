<template>
    <div class="user">
        <div class="form">
            <el-form :model="formData">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-form-item :label="'昵称'">
                            <el-input clearable placeholder="请输入昵称" v-model="formData.nickNameFuzzy"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item :label="'性别'">
                            <el-select clearable v-model="formData.sex" placeholder="请选择性别">
                                <el-option label="女" :value="0" />
                                <el-option label="男" :value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item :label="'状态'">
                            <el-select clearable v-model="formData.status" placeholder="请选择状态">
                                <el-option label="启用" :value="1" />
                                <el-option label="禁用" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <!-- <el-button-group>
                            <el-button type="primary" @click="getData">搜索</el-button>
                            <el-button type="success" @click="batchOption('check')" :disabled="!selectedRow.length">
                                批量审批
                            </el-button>
                            <el-button type="danger" @click="batchOption('remove')" :disabled="!selectedRow.length">
                                批量删除
                            </el-button>
                        </el-button-group> -->
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- @selected="selected" :showSelect="true"  -->
        <Table v-loading="loading" :data="tableData" :tableColumn="tableColumn" :height="height"
            @pageChange="handlePageChange" @sizeChange="handleSizeChange">
            <!-- 头像 -->
            <template #avatar="{ row }">
                <Avatar :link="false" :userId="row.userId" :size="50"></Avatar>
            </template>
            <template #sex="{ row }">
                <span>{{ row.sex === 1 ? '男' : '女' }}</span>
            </template>
            <!-- 登录信息 -->
            <template #loginInfo="{ row }">
                <div class="login-info">
                    <div>最后登录时间：{{ row.lastLoginTime }}</div>
                    <div>最后登录IP：{{ row.lastLoginIp }}</div>
                    <div>最后登录地点：{{ row.lastLoginIpAddress }}</div>
                </div>
            </template>
            <!-- 积分 -->
            <template #integral="{ row }">
                <div class="integral-info">
                    <div>总积分：{{ row.totalIntegral }}</div>
                    <div>当前积分：{{ row.currentIntegral }}</div>
                </div>
            </template>
            <!-- 状态信息 -->
            <template #status="{ row }">
                <div class="status-info">
                    <div>
                        <span :style="{ color: '#2ed573' }" v-if="row.status === 1">正常</span>
                        <span :style="{ color: '#ff4757' }" v-else>禁用</span>
                    </div>
                </div>
            </template>
            <template #op="{ row }">
                <el-dropdown>
                    <i :style="{ cursor: 'pointer' }" class="iconfont icon-more"></i>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleChangeStatus(row)">{{ row.status === 1 ? '禁用' : '启用'
                            }}</el-dropdown-item>
                            <el-dropdown-item @click="handleSendMsg(row)">发送系统消息</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </Table>
        <SendMsg ref="sendMsgRef" @submit="getData" />
    </div>
</template>

<script setup>
import SendMsg from './components/SendMsg.vue';
import { usePagePxStore } from '@/stores/pagePx.js'
import { storeToRefs } from 'pinia'
import { reactive, inject, ref, getCurrentInstance } from 'vue';
import { loadUserList, updateUserStatus } from '@/api/user.js'

const { proxy } = getCurrentInstance()
const globalInfo = inject('globalInfo')

const pagePxStore = usePagePxStore()
const { headerAndMenuHeight } = storeToRefs(pagePxStore)
// 内容区域高度 = 可视区域高度-头部及标签高度 - 表单部分高度
const height = document.documentElement.clientHeight - headerAndMenuHeight.value - 50

const loading = ref(false)
const formData = reactive({
    nickNameFuzzy: '',//昵称模糊搜索
    sex: null,//内容模糊搜索
    status: null,//状态 0:禁用 1:启用
})
const tableData = reactive({
    list: [],
    pageNo: 1,
    pageSize: 15,
    pageTotal: 0,
    totalCount: 0,
})
const tableColumn = [
    {
        label: '头像',
        prop: 'avatar',
        scoped: 'avatar',
        width: 80,
    },
    {
        label: '昵称',
        prop: 'nickName',
        width: 100,
    },
    {
        label: '性别',
        prop: 'sex',
        scoped: 'sex',
        width: 60,
    },
    {
        label: '邮箱',
        prop: 'email',
        width: 210,
    },
    {
        label: '个人描述',
        prop: 'personDescription',
    },
    {
        label: '加入时间',
        prop: 'joinTime',
        width: 170,
    },
    {
        label: '登录信息',
        prop: 'loginInfo',
        scoped: 'loginInfo',
        width: 270,
    },
    {
        label: '积分',
        prop: 'integral',
        scoped: 'integral',
        width: 140,
    },
    {
        label: '状态',
        prop: 'status',
        scoped: 'status',
        width: 70,
    },
    {
        label: '操作',
        prop: 'op',
        scoped: 'op',
        width: 50,
    },
]


const selectedRow = reactive([])//选中的行
// const fn = {
//     remove: {
//         api: delComment,
//         text: '删除',
//     },
//     check: {
//         api: auditComment,
//         text: '审核',
//     },
// }
// // 批量处理
// const batchOption = (type) => {
//     const option = fn[type]
//     proxy.Confirm(`确定对所选中的评论进行${option.text}操作？`, '提示', async () => {
//         const params = {}
//         params.commentIds = selectedRow.map(el => {
//             return el.commentId
//         }).join(',')
//         if (type === 'remove') {
//             params.articleIds = selectedRow.map(el => {
//                 return el.articleid
//             }).join(',')
//         }
//         const result = await option.api(params)
//         if (!result) {
//             return
//         }
//         proxy.Message.success(`${option.text}成功`)
//         getData()
//     })
// }
// // 单个处理
// const handleOption = (type, row) => {
//     const option = fn[type]
//     proxy.Confirm(`确定${option.text}【${row.content}】`, '提示', async () => {
//         const params = {}
//         params.commentIds = row.commentId
//         if (type === 'remove') {
//             params.articleIds = row.articleId
//         }
//         const result = await option.api(params)
//         if (!result) {
//             return
//         }
//         proxy.Message.success(`${option.text}成功`)
//         getData()
//     })
// }
const selected = (rowArr) => {
    selectedRow.splice(0, selectedRow.length, ...rowArr)
}

// 处理状态变更
const handleChangeStatus = (row) => {
    const statusObj = {}
    if (row.status===1) {
        statusObj.status = 0
        statusObj.text = '禁用'
    }else{
        statusObj.status = 1
        statusObj.text = '启用'
    }
    proxy.Confirm(`您确定要${statusObj.text}【${row.nickName}】`, '提示', () => {
        const status = statusObj.status
        const params = {
            status,
            userId: row.userId
        }
        statusChange(params)
    })

}
const statusChange = async (params) => {
    const result = await updateUserStatus(params)
    if (!result) {
        return
    }
    proxy.Message.success('状态变更成功')
    getData()
}

// 处理发送消息
const sendMsgRef = ref(null)
const handleSendMsg = (row)=>{
    sendMsgRef.value.showSendMsg(row)
}


// 处理分页变化
const handlePageChange = (page) => {
    tableData.pageNo = page
    getData()
}
// 处理分页大小变化
const handleSizeChange = (size) => {
    tableData.pageNo = 1
    tableData.pageSize = size
    getData()
}

// 获取表格数据
const getData = async () => {
    loading.value = true
    const params = {}
    Object.assign(params, formData, { pageNo: tableData.pageNo, pageSize: tableData.pageSize })
    const result = await loadUserList(params)
    if (!result) {
        return
    }
    Object.assign(tableData, result.data)
    loading.value = false
}


const init = async () => {
    await getData()
}
init()

</script>

<style lang="scss" scoped>
.user {
    .login-info {
        text-align: left;
    }
}
</style>