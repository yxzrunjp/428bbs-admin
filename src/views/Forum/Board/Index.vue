<template>
    <div class="board">
        <div class="top">
            <el-button type="primary" @click="showEdit('add', 0)">新增板块</el-button>
        </div>
        <el-row :gutter="10">
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span class="card-title">一级板块</span>
                        </div>
                    </template>
                    <Table ref="leftTableRef" @rowClick="leftTableRowClick" :data="leftData" :height="height"
                        :tableColumn="tableColumn">
                        <template #cover="{ row }">
                            <Cover v-if="row.cover" :style="{ width: '70px', height: '70px' }"
                                :url="`${globalInfo.getImageUrl}/${row.cover}`"></Cover>
                            <span v-else>暂无封面</span>
                        </template>
                        <template #boardInfo="{ row }">
                            <div class="board-info">
                                <div class="board-name">板块名称：{{ row.boardName }}</div>
                                <div class="board-auth">
                                    发帖权限：{{ postType[row.postType] }}
                                </div>
                            </div>
                        </template>
                        <template #op="{ row, index }">
                            <div class="options">
                                <span class="text-btn" @click.stop="showEdit('update', 0, row)">修改</span>
                                <el-divider direction="vertical" />
                                <span class="text-btn" @click.stop="handleDelete(row, 0)">删除</span>
                                <el-divider direction="vertical" />
                                <span @click.stop="handleChangeSort(index, 'up', leftData.list, 'left')"
                                    :class="[index === 0 ? 'text-btn-disable' : 'text-btn']">上移</span>
                                <el-divider direction="vertical" />
                                <span @click.stop="handleChangeSort(index, 'down', leftData.list, 'left')"
                                    :class="[index === leftDataLastIdx ? 'text-btn-disable' : 'text-btn']">下移</span>
                            </div>
                        </template>
                    </Table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span class="card-title">二级板块</span>
                            <span class="text-btn" @click="showEdit('add', 1)">新增板块</span>
                        </div>
                    </template>
                    <Table :data="rightData" :height="height" :tableColumn="tableColumn">
                        <template #cover="{ row }">
                            <Cover v-if="row.cover" :style="{ width: '70px', height: '70px' }"
                                :url="`${globalInfo.getImageUrl}/${row.cover}`"></Cover>
                            <span v-else>暂无封面</span>
                        </template>
                        <template #boardInfo="{ row }">
                            <div class="board-info">
                                <div class="board-name">板块名称：{{ row.boardName }}</div>
                                <div class="board-auth">
                                    发帖权限：{{ postType[row.postType] }}
                                </div>
                            </div>
                        </template>
                        <template #op="{ row, index }">
                            <div class="options">
                                <span class="text-btn" @click.stop="showEdit('update', 1, row)">修改</span>
                                <el-divider direction="vertical" />
                                <span class="text-btn" @click.stop="handleDelete(row, 1)">删除</span>
                                <el-divider direction="vertical" />
                                <span @click.stop="handleChangeSort(index, 'up', rightData.list, 'right')"
                                    :class="[index === 0 ? 'text-btn-disable' : 'text-btn']">上移</span>
                                <el-divider direction="vertical" />
                                <span @click.stop="handleChangeSort(index, 'down', rightData.list, 'right')"
                                    :class="[index === rightDataLastIdx ? 'text-btn-disable' : 'text-btn']">下移</span>
                            </div>
                        </template>
                    </Table>
                </el-card>
            </el-col>
        </el-row>
        <EditBoard ref="editBoardRef" @finish="handleFinish" />
    </div>
</template>

<script setup>
import EditBoard from './components/EditBoard.vue'
import { reactive, inject, computed, ref, provide, getCurrentInstance } from 'vue';
import { loadBoard, changeBoardSort, delBoard } from '@/api/board.js'
import { usePagePxStore } from '@/stores/pagePx.js'
import { storeToRefs } from 'pinia'
const { proxy } = getCurrentInstance()
const globalInfo = inject('globalInfo')
const postType = {
    0: '只允许管理员发帖',
    1: '任何人可以发帖',
}
provide('postType', postType)

const pagePxStore = usePagePxStore()
const { headerAndMenuHeight } = storeToRefs(pagePxStore)
// 内容区域高度 = 可视区域高度-头部及标签高度 - 其他部分
const height = document.documentElement.clientHeight - headerAndMenuHeight.value - 10 - 32 - 10 - 60 - 40

const tableColumn = [
    {
        prop: 'cover',
        label: '封面',
        width: 100,
        scoped: 'cover',
    },
    {
        prop: 'boardInfo',
        label: '板块信息',
        scoped: 'boardInfo',
    },
    {
        prop: 'boardDesc',
        label: '简介',
        width: 100,
    },
    {
        prop: 'op',
        label: '操作',
        scoped: 'op',
        width: 220,

    },
]
// 父级板块
let currentSelectBoardId = null//父级板块表格当前选中项
const leftTableRef = ref(null)
const leftData = reactive({
    list: []
})
const leftDataLastIdx = computed(() => {
    return leftData.list.length - 1
})
// 一级板块表格行点击事件
const leftTableRowClick = (row) => {
    setLeftTableRowSelected(row.boardId)
    rightData.list.splice(0, rightData.list.length, ...row.children)
}
// 一级板块行选中
const setLeftTableRowSelected = (boardId) => {
    currentSelectBoardId = boardId
    leftTableRef.value.selecteRow('boardId', currentSelectBoardId)
}

/**
 * 一级板块重置选中项
 * @param {*} isReset true:重置为默认选中项(第一行) false:选中项不变
 */
const resetLeftTableRowSelected = (isDefault) => {
    if (isDefault) {
        // 操作的是一级板块-默认选中第一项
        const firstRow = leftData.list[0]
        leftTableRowClick(firstRow)
    } else {
        // 操作的是二级板块-选中项不变
        const row = leftData.list.find(el => {
            return el.boardId === currentSelectBoardId
        })
        leftTableRowClick(row)
    }
}

// 板块排序
const handleChangeSort = async (index, type, arr, tableName) => {
    // 第一位及最后一位不操作
    if (index === 0 && type === 'up' || index === arr.length - 1 && type === 'down') {
        return
    }
    // 更换顺序
    const number = type === 'up' ? -1 : 1;
    const temp = arr[index]
    arr[index] = arr[index + number]
    arr[index + number] = temp

    const boardIds = arr.map(el => {
        return el.boardId
    }).join(',')
    // 改变排序
    await changeSort({ boardIds })
    // 重新获取数据
    await getBoardInfo()
    // 重新选中行
    setLeftTableRowSelected(currentSelectBoardId)
}
const changeSort = async (params) => {
    const result = await changeBoardSort(params)
    if (!result) {
        return
    }
}

// 子级板块
const rightData = reactive({
    list: []
})
const rightDataLastIdx = computed(() => {
    return rightData.list.length - 1
})

// 新增板块/修改板块
const editBoardRef = ref(null)
const showEdit = (type, level, row) => {
    // 选出当前选中的一级板块行
    const currentRow = leftData.list.find(el => {
        return el.boardId === currentSelectBoardId
    })
    
    const pBoardName = level === 0 ? '' : currentRow.boardName
    const dialogTitle = type === 'add' ? '新增板块' : '修改板块'
    const data = {
        row: row || { pBoardId: level === 0 ? 0 : currentRow.boardId },
        dialogTitle,
        pBoardName
    }
    editBoardRef.value.showEditBoard(data)
}
const handleFinish = async (isChild) => {
    await getBoardInfo()
    resetLeftTableRowSelected(!isChild)
}

// 删除板块
const handleDelete = (row, level) => {
    proxy.Confirm(`确定删除【${row.boardName}】?`, '提示', async () => {
        const params = {
            boardId: row.boardId
        }
        await deleteBoard(params)
        // 重新获取数据
        await getBoardInfo()
        resetLeftTableRowSelected(level === 0)
    })
}
const deleteBoard = async (params) => {
    const result = await delBoard(params)
    if (!result) {
        return
    }
    proxy.Message.success('删除成功')
}

// 获取板块信息
const getBoardInfo = async () => {
    const result = await loadBoard()
    if (!result) {
        return
    }
    leftData.list.splice(0, leftData.list.length, ...result.data)
}
const init = async () => {
    // 获取板块信息
    await getBoardInfo()
    // 子版块默认选中第一个
    const firstRow = leftData.list[0]
    leftTableRowClick(firstRow)
}
init()
</script>

<style lang="scss" scoped>
.board {
    margin-top: 10px;

    .top {
        margin-bottom: 10px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-title {
            font-weight: bold;
        }
    }

    .board-info {
        text-align: left;
    }
}
</style>