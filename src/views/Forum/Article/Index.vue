<template>
    <div class="article">
        <Table :data="data" :tableOptions="tableOptions">
            <template #address="{ row }">
                <div class="address">地址：{{ row.address }}</div>
            </template>
            <template #name="{ row }">
                <div class="name">名字：{{ row.name }}</div>
            </template>
        </Table>
    </div>
</template>

<script setup>
import { usePagePxStore } from '@/stores/pagePx.js'
import { storeToRefs } from 'pinia'
const pagePxStore = usePagePxStore()
const { headerAndMenuHeight } = storeToRefs(pagePxStore)
// 内容区域高度 = 可视区域高度-头部及标签高度 - 表单部分高度
const height = document.documentElement.clientHeight - headerAndMenuHeight.value
console.log(height);
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]
const data = {
    list: tableData,
    pageNo: 1,
    pageSize: 15,
    pageTotal: 0,
    totalCount: 0,
}

const tableOptions = {
    showSelect: false,
    height,
    tableColumn: [
        {
            prop: 'date',
            label: '日期',
        },
        {
            prop: 'name',
            label: '名字',
            scoped: 'name'
        },
        {
            prop: 'address',
            label: '地址',
            scoped: 'address'
        },
    ]
}

</script>

<style lang="scss" scoped></style>