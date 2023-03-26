<template>
    <div class="article">
        <Table :data="data" :tableOptions="tableOptions">
            <template #address="{row}">
                <div class="address">地址：{{ row.address }}</div>
            </template>
            <template #name="{row}">
                <div class="name">名字：{{ row.name }}</div>
            </template>
        </Table>
    </div>
</template>

<script setup>
import Table from '@/components/Table.vue';
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
    height:700,
    tableColumn: [
        {
            prop: 'date',
            label: '日期',
        },
        {
            prop: 'name',
            label: '名字',
            scoped:'name'
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