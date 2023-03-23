<template>
    <div class="layout">
        <el-container>
            <el-aside class="menu-aside" :width="asideWidth + 'px'">
                <div class="sys-title">
                    <template v-if="!isShrink">
                        浮云论坛管理系统
                    </template>
                </div>
                <AsideMenu />
            </el-aside>
            <el-container>
                <el-header :style="{ height: headerHeight + 'px' }">
                    <div class="shrink-icon" @click="handleCollapse">
                        <i class="iconfont icon-collapse"></i>
                    </div>
                    <el-breadcrumb :separator-icon="ArrowRight">
                        <el-breadcrumb-item v-for="bread in breadcrumbList" :key="bread">{{ bread }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-header>
                <el-main>
                    <RouterView></RouterView>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import AsideMenu from './components/AsideMenu.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { usePagePxStore } from '@/stores/pagePx.js'
import { useRoute } from 'vue-router'
import { reactive, watch } from 'vue';

const pagePxStore = usePagePxStore()
const { asideWidth, headerHeight, isShrink } = storeToRefs(pagePxStore)

const route = useRoute()

/**
 * 当前收缩侧边栏会有卡顿现象，暂不实现该功能
 */
const handleCollapse = () => {
    // return
    pagePxStore.$patch({
        isShrink: !isShrink.value,
    })
}
const breadcrumbList = reactive([])
watch(() => route, (newV) => {
    // 配置面包屑
    const newBread = newV.matched.slice(1).map(el => {
        return el.meta.label
    })
    breadcrumbList.splice(0, breadcrumbList.length, ...newBread)
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped>
.layout {
    .el-container {
        .menu-aside {
            height: 100vh;
            // transition: width .3s;

            .sys-title {
                background-color: aquamarine;
                text-align: center;
                height: 50px;
                line-height: 50px;
            }
        }

        .el-container {
            .el-header {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .shrink-icon {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>