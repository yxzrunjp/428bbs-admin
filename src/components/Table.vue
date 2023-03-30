<template>
    <div class="table-wrap" :style="{ height: height + 'px' }">
        <div class="table">
            <el-table stripe border highlight-current-row :max-height="height - paginationHeight" ref="tableRef"
                :data="data.list" style="width: 100%" @selection-change="handleSelectionChange" @row-click="handleRowClick">
                <el-table-column v-if="showSelect" type="selection" width="55" />
                <template v-for="column in tableColumn" :key="column.prop">
                    <el-table-column :prop="column.prop" :label="column.label" :width="column.width"
                        :align="column.align || 'center'">
                        <template v-if="column.scoped" #default="scope">
                            <slot :name="column.scoped" :row="scope.row" :index="scope.$index"></slot>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <div class="pagination" v-if="data.totalCount" :style="{ height: paginationHeight + 'px' }">
            <el-pagination :current-page="data.pageNo" :page-size="data.pageSize" background :page-sizes="[15, 30, 50, 100]"
                layout="total, sizes, prev, pager, next" :total="data.totalCount" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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
    showSelect: {
        type: Boolean,
        default: false,
    },
    height: {
        type: Number,
        default: 500,
    },
    tableColumn: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const paginationHeight = ref(0)
watch(() => prop.data, (newV) => {
    if (newV.totalCount) {
        paginationHeight.value = 50
    }
}, { deep: true })
const tableRef = ref(null)
const emit = defineEmits(['sizeChange', 'pageChange', 'selected', 'rowClick'])
// 行点击
const handleRowClick = (...args) => {
    emit('rowClick', ...args)
}
// 表格选择
const handleSelectionChange = (val) => {
    emit('selected', val)
}
// 分页大小变化
const handleSizeChange = (size) => {
    emit('sizeChange', size)
}
// 页变化
const handleCurrentChange = (page) => {
    emit('pageChange', page)
}
// 表格行选中
const selecteRow = (key, value) => {
    const row = prop.data.list.find(el => {
        return el[key] === value
    })
    tableRef.value.setCurrentRow(row)
}
defineExpose({
    selecteRow
})
</script>

<style lang="scss" scoped>
.table-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .pagination {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>