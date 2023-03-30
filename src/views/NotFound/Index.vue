<template>
    <div class="not-found">
        <el-empty :image-size="500" :description="'页面不存在'"></el-empty>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.not-found {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-empty {
        &:deep(.el-empty__description) {
            p {
                font-size: 50px;
            }
        }

    }
}
</style>