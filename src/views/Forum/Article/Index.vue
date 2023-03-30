<template>
    <div class="article">
        <div class="form">
            <el-form :model="formData">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-form-item :label="'标题'">
                            <el-input clearable placeholder="请输入标题" v-model="formData.titleFuzzy"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item :label="'昵称'">
                            <el-input clearable placeholder="请输入昵称" v-model="formData.nickNameFuzzy"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item :label="'板块'">
                            <el-cascader placeholder="请选择板块" :props="boardProps" clearable v-model="formData.boardInfo"
                                :options="boardList" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item :label="'附件'">
                            <el-select clearable v-model="formData.attachmentType" placeholder="请选择">
                                <el-option label="有附件" :value="1" />
                                <el-option label="无附件" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item :label="'状态'">
                            <el-select clearable v-model="formData.status" placeholder="请选择">
                                <el-option label="已审核" :value="1" />
                                <el-option label="待审核" :value="0" />
                                <el-option label="已删除" :value="-1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-form-item :label="'置顶'">
                            <el-select clearable v-model="formData.topType" placeholder="请选择">
                                <el-option label="已置顶" :value="1" />
                                <el-option label="未置顶" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-button-group>
                            <el-button type="primary" @click="getData">搜索</el-button>
                            <el-button type="success" @click="batchOption('check')" :disabled="!selectedRow.length">
                                批量审批
                            </el-button>
                            <el-button type="danger" @click="batchOption('remove')" :disabled="!selectedRow.length">
                                批量删除
                            </el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <Table v-loading="loading" :showSelect="true" :data="tableData" :tableColumn="tableColumn" :height="height"
            @pageChange="handlePageChange" @sizeChange="handleSizeChange" @selected="selected">
            <!-- 用户信息 -->
            <template #userInfo="{ row }">
                <div class="user-info">
                    <Avatar :userId="row.userId" :link="false" :size="50"></Avatar>
                    <div class="user-info-left">
                        <div class="nickname">
                            <a class="text-btn" :href="`${globalInfo.clientAddress}/user/${row.userId}`" target="_blank">
                                {{ row.nickName }}
                            </a>
                        </div>
                        <div class="address">{{ row.userIpAddress }}</div>
                    </div>
                </div>
            </template>
            <!-- 封面 -->
            <template #cover="{ row }">
                <Cover v-if="row.cover" :url="`${globalInfo.getImageUrl}/${row.cover}`"></Cover>
                <span v-else>暂无封面</span>
            </template>
            <!-- 标题 -->
            <template #title="{ row }">
                <div class="title">
                    <a class="text-btn" :href="`${globalInfo.clientAddress}/articleDetail/${row.articleId}`"
                        target="_blank">
                        {{ row.title }}
                    </a>
                </div>
            </template>
            <!-- 板块 -->
            <template #board="{ row }">
                <div class="board-info">
                    <span>{{ row.pBoardName }}</span>
                    <span v-if="row.boardName">/{{ row.boardName }}</span>
                </div>
            </template>
            <!-- 互动信息 -->
            <template #interactionInfo="{ row }">
                <div class="interaction-info">
                    <div>阅读：{{ row.readCount }}</div>
                    <div>点赞：{{ row.goodCount }}</div>
                    <div>评论：{{ row.commentCount }}
                        <span @click="previewComment(row)" v-if="row.commentCount" :style="{ marginLeft: '4px' }"
                            class="text-btn">查看</span>
                    </div>
                </div>
            </template>
            <!-- 是否有附件 -->
            <template #attachmentType="{ row }">
                <div v-if="row.attachmentType" @click="previewFileInfo(row)" class="text-btn">查看附件</div>
                <div v-else>无附件</div>
            </template>
            <!-- 状态信息 -->
            <template #status="{ row }">
                <div class="status-info">
                    <div>
                        <span :style="{ color: '#2ed573' }" v-if="row.status === 1">已审核</span>
                        <span :style="{ color: '#ff4757' }" v-else-if="row.status === -1">已删除</span>
                        <span :style="{ color: '#ffa502' }" v-else>待审核</span>
                    </div>
                    <div>
                        <span :style="{ color: '#2ed573' }" v-if="row.topType === 1">已置顶</span>
                        <span :style="{ color: '#ffa502' }" v-else>未置顶</span>
                    </div>
                </div>
            </template>
            <template #op="{ row }">
                <template v-if="row.status !== -1">
                    <el-dropdown>
                        <i :style="{ cursor: 'pointer' }" class="iconfont icon-more"></i>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleUpdateBoard(row)">修改板块</el-dropdown-item>
                                <template v-if="row.status === 1">
                                    <el-dropdown-item @click="handleTopType(row)">{{ row.topType === 1 ? '取消置顶' : '置顶'
                                    }}</el-dropdown-item>
                                </template>
                                <el-dropdown-item @click="handleOption('remove', row)">删除</el-dropdown-item>
                                <el-dropdown-item @click="handleOption('check', row)">审核</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </template>
        </Table>

        <UpdateBoard ref="updateBoardRef" :boardList="boardList" :boardProps="boardProps" @updateSuccess="getData" />
        <FileInfo ref="fileInfoRef" />
        <CommentInfo ref="commentInfoRef" />
        <ImagePreview :urlList="urlList" :show="imgShow" @closeImg="closeImg" />
    </div>
</template>

<script setup>
import ImagePreview from '@/components/ImagePreview.vue';
import UpdateBoard from './components/UpdateBoard.vue';
import FileInfo from './components/FileInfo.vue';
import CommentInfo from './components/CommentInfo.vue'
import { usePagePxStore } from '@/stores/pagePx.js'
import { storeToRefs } from 'pinia'
import { reactive, inject, ref, getCurrentInstance, provide } from 'vue';
import { loadArticle, delArticle, auditArticle, topArticle } from '@/api/article.js'
import { loadBoard } from '@/api/board.js'

const { proxy } = getCurrentInstance()
const globalInfo = inject('globalInfo')

const pagePxStore = usePagePxStore()
const { headerAndMenuHeight } = storeToRefs(pagePxStore)
// 内容区域高度 = 可视区域高度-头部及标签高度 - 表单部分高度
const height = document.documentElement.clientHeight - headerAndMenuHeight.value - 100

const loading = ref(false)
const formData = reactive({
    boardInfo: null,
    titleFuzzy: '',//标题模糊搜索
    nickNameFuzzy: '',//昵称模糊搜索
    attachmentType: null,//是否有附件 0:无附件  1:有附件
    status: null,//状态 -1:已删除  0:待审核 1:已审核
    topType: null
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
        label: '用户信息',
        prop: 'userInfo',
        scoped: 'userInfo',
        width: 160,
    },
    {
        label: '封面',
        prop: 'cover',
        scoped: 'cover',
        width: 110,
    },
    {
        label: '标题',
        prop: 'title',
        scoped: 'title',
    },
    {
        label: '板块',
        prop: 'board',
        scoped: 'board',
        width: 150,
    },
    {
        label: '互动信息',
        prop: 'interactionInfo',
        scoped: 'interactionInfo',
        width: 140,
    },
    {
        label: '是否有附件',
        prop: 'attachmentType',
        scoped: 'attachmentType',
        width: 100,
    },
    {
        label: '状态信息',
        prop: 'status',
        scoped: 'status',
        width: 100,
    },
    {
        label: '发布时间',
        prop: 'postTime',
        width: 170,
    },
    {
        label: '发布地址',
        prop: 'userIpAddress',
        width: 100,
    },
    {
        label: '操作',
        prop: 'op',
        scoped: 'op',
        width: 50,
    },
]


const selectedRow = reactive([])//选中的行
const fn = {
    remove: {
        api: delArticle,
        text: '删除',
    },
    check: {
        api: auditArticle,
        text: '审核',
    },
}
// 批量处理
const batchOption = (type) => {
    const option = fn[type]
    proxy.Confirm(`确定对所选中的帖子进行${option.text}操作？`, '提示', async () => {
        const params = {}
        params.articleIds = selectedRow.map(el => {
            return el.articleId
        }).join(',')
        const result = await option.api(params)
        if (!result) {
            return
        }
        proxy.Message.success(`${option.text}成功`)
        getData()
    })
}
// 单个处理
const handleOption = (type, row) => {
    const option = fn[type]
    proxy.Confirm(`确定${option.text}【${row.title}】`, '提示', async () => {
        const params = {
            articleIds: row.articleId
        }
        const result = await option.api(params)
        if (!result) {
            return
        }
        proxy.Message.success(`${option.text}成功`)
        getData()
    })
}
const selected = (rowArr) => {
    selectedRow.splice(0, selectedRow.length, ...rowArr)
}

const updateBoardRef = ref(null)
// 处理更新板块
const handleUpdateBoard = (row) => {
    updateBoardRef.value.showUpdateDialog(row)
}

// 处理板块置顶
const handleTopType = async (row) => {
    // 0:取消置顶 1 置顶
    const topType = row.topType === 1 ? 0 : 1
    const articleId = row.articleId
    const result = await topArticle({
        topType, articleId
    })
    if (!result) {
        return
    }
    proxy.Message.success(`${topType ? '置顶' : '取消置顶'}成功`)
    getData()
}

// 查看附件
const fileInfoRef = ref(null)
const previewFileInfo = (row) => {
    fileInfoRef.value.showFileInfo(row)
}

// 查看评论
const commentInfoRef = ref(null)
const previewComment = (row) => {
    commentInfoRef.value.showCommentInfo(row)
}

// 预览评论中的图片
const urlList = reactive([])
const imgShow = ref(false)

const previewImg = (url) => {
    urlList.splice(0, urlList.length, url)
    imgShow.value = true
}
// 提供给子组件调用
provide('previewImg', previewImg)
const closeImg = () => {
    imgShow.value = false
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
    if (params.boardInfo) {
        params.boardInfo[0] && (params.pBoardId = params.boardInfo[0]);
        params.boardInfo[1] && (params.boardId = params.boardInfo[1]);
    }
    delete params.boardInfo
    const result = await loadArticle(params)
    if (!result) {
        return
    }
    Object.assign(tableData, result.data)
    loading.value = false
}

// 获取板块
const boardList = reactive([])
const boardProps = {
    expandTrigger: 'hover',
    children: 'children',
    value: 'boardId',
    label: 'boardName',
    checkStrictly: true,
}
const getBoard = async () => {
    const result = await loadBoard()
    if (!result) {
        return
    }
    boardList.splice(0, boardList.length, ...result.data)
}

const init = async () => {
    await getData()
    await getBoard()
}
init()

</script>

<style lang="scss" scoped>
.article {
    .user-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .user-info-left {
            margin-left: 10px;
            font-size: 14px;
            text-align: left;

            .nickname {}

            .address {
                margin-top: 4px;
                color: $color-font;
            }
        }
    }

    .interaction-info {
        text-align: left;
    }
}
</style>