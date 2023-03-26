<template>
    <div class="table-wrap">
        <div class="table">
            <el-table stripe border highlight-current-row :height="tableOptions.height - paginationHeight" ref="tableRef"
                :data="data.list" style="width: 100%" @selection-change="handleSelectionChange" @row-click="handleRowClick">
                <el-table-column v-if="tableOptions.showSelect" type="selection" width="55" />
                <template v-for="column in tableOptions.tableColumn" :key="column.prop">
                    <el-table-column :prop="column.prop" :label="column.label" :width="column.width"
                        :align="column.align || 'center'">
                        <template v-if="column.scoped" #default="scope">
                            <slot :name="column.scoped" :row="scope.row"></slot>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <div class="pagination" :style="{ height: paginationHeight + 'px' }">
            <el-pagination :current-page="data.pageNo" :page-size="data.pageSize" background :page-sizes="[15, 30, 50, 100]"
                layout="total, sizes, prev, pager, next" :total="data.totalCount" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const paginationHeight = ref(50)
const prop = defineProps({
    data: {
        type: Object,
        default: () => {
            return {
                list: [],
                pageNo: 1,
                pageSize: 15,
                pageTotal: 0,
                totalCount: 0,
            }
        }
    },
    tableOptions: {
        type: Object,
        default: () => {
            return {
                showSelect: false,
                height: 500,
                paginationHeight: 50,
                tableColumn: [
                    {
                        prop: 'date',
                        label: '日期',
                    },
                    {
                        prop: 'name',
                        label: '名字',
                    },
                    {
                        prop: 'address',
                        label: '地址',
                    },
                ],
            }
        }
    }
})

const tableRef = ref(null)

// 行点击
const handleRowClick = () => {
    console.log(`row click`);
}
// 表格选择
const handleSelectionChange = () => {
    console.log(`selected`);
}
// 分页大小变化
const handleSizeChange = (size) => {
    console.log(`size`, size);
}
// 页变化
const handleCurrentChange = (page) => {
    console.log(`page`, page);
}
</script>

<style lang="scss" scoped>
.table-wrap {
    .pagination {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>