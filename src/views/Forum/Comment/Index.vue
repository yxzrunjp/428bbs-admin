<template>
    <div class="comment">
        <div class="form">
            <el-form :model="formData">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-form-item :label="'内容'">
                            <el-input clearable placeholder="请输入内容" v-model="formData.contentFuzzy"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item :label="'昵称'">
                            <el-input clearable placeholder="请输入昵称" v-model="formData.nickNameFuzzy"></el-input>
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
            <!-- 评论内容 -->
            <template #content="{ row }">
                <div class="commnet-info">
                    <div class="preview-article">
                        <a class="text-btn" :href="`${globalInfo.clientAddress}/articleDetail/${row.articleId}`"
                            target="_blank">
                            查看文章
                        </a>
                    </div>
                    <div class="content-wrap">
                        <div class="content">{{ row.content }}</div>
                        <Cover @click.stop="previewImg(row)" v-if="row.imgPath"
                            :url="`${globalInfo.getImageUrl}/${row.imgPath.replace('.', '_.')}`" />
                    </div>
                </div>
            </template>
            <!-- 状态信息 -->
            <template #status="{ row }">
                <div class="status-info">
                    <div>
                        <span :style="{ color: '#2ed573' }" v-if="row.status === 1">已审核</span>
                        <span :style="{ color: '#ff4757' }" v-else-if="row.status === -1">已删除</span>
                        <span :style="{ color: '#ffa502' }" v-else>待审核</span>
                    </div>
                </div>
            </template>
            <template #op="{ row }">
                <template v-if="row.status !== -1">
                    <el-dropdown>
                        <i :style="{ cursor: 'pointer' }" class="iconfont icon-more"></i>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleOption('remove', row)">删除</el-dropdown-item>
                                <el-dropdown-item v-if="row.status === 0"
                                    @click="handleOption('check', row)">审核</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </template>
        </Table>
        <ImagePreview :urlList="imgList" :show="imgShow" @closeImg="closeImg" />
    </div>
</template>

<script setup>
import ImagePreview from '@/components/ImagePreview.vue';
import { usePagePxStore } from '@/stores/pagePx.js'
import { storeToRefs } from 'pinia'
import { reactive, inject, ref, getCurrentInstance } from 'vue';
import { auditComment, delComment, loadComment } from '@/api/article.js'

const { proxy } = getCurrentInstance()
const globalInfo = inject('globalInfo')

const pagePxStore = usePagePxStore()
const { headerAndMenuHeight } = storeToRefs(pagePxStore)
// 内容区域高度 = 可视区域高度-头部及标签高度 - 表单部分高度
const height = document.documentElement.clientHeight - headerAndMenuHeight.value - 50

const loading = ref(false)
const formData = reactive({
    contentFuzzy: '',//内容模糊搜索
    nickNameFuzzy: '',//昵称模糊搜索
    status: null,//状态 -1:已删除  0:待审核 1:已审核
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
        label: '评论内容',
        prop: 'content',
        scoped: 'content',
    },
    {
        label: '点赞',
        prop: 'goodCount',
        width: 60,
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
        api: delComment,
        text: '删除',
    },
    check: {
        api: auditComment,
        text: '审核',
    },
}
// 批量处理
const batchOption = (type) => {
    const option = fn[type]
    proxy.Confirm(`确定对所选中的评论进行${option.text}操作？`, '提示', async () => {
        const params = {}
        params.commentIds = selectedRow.map(el => {
            return el.commentId
        }).join(',')
        if (type === 'remove') {
            params.articleIds = selectedRow.map(el => {
                return el.articleid
            }).join(',')
        }
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
    proxy.Confirm(`确定${option.text}【${row.content}】`, '提示', async () => {
        const params = {}
        params.commentIds = row.commentId
        if (type === 'remove') {
            params.articleIds = row.articleId
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

// 预览图片
const imgList = reactive([])
const imgShow = ref(false)
const imgIdx = ref(0)
const previewImg = (row) => {
    const url = `${globalInfo.getImageUrl}/${row.imgPath}`
    imgList.splice(0, imgList.length, url)
    imgShow.value = true
}
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
    const result = await loadComment(params)
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
.comment {
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

    .commnet-info {
        text-align: left;

        .preview-article {
            margin-bottom: 4px;
        }

        .content-wrap {
            .content {
                margin-bottom: 4px;
            }
        }
    }
}
</style>