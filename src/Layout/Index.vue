<template>
    <div class="layout">
        <el-container>
            <el-aside class="menu-aside" :width="asideWidth + 'px'">
                <div class="sys-title" :style="{ height: headerHeight + 'px', lineHeight: headerHeight + 'px' }">
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
                    <div class="tabs-wrap" :style="{ height: tabsHeight + 'px' }">
                        <el-tabs v-model="activeName" :closable="editableTabs.length > 1" type="card" class="page-tabs"
                            @tab-click="handleTabClick" @edit="handleTabsEdit">
                            <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.label"
                                :name="item.name">
                            </el-tab-pane>
                        </el-tabs>
                    </div>

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
import { useRoute, useRouter } from 'vue-router'
import { reactive, watch, ref } from 'vue';

const pagePxStore = usePagePxStore()
const { asideWidth, headerHeight, isShrink,tabsHeight } = storeToRefs(pagePxStore)

const route = useRoute()
const router = useRouter()

// menu收缩
const handleCollapse = () => {
    // return
    pagePxStore.$patch({
        isShrink: !isShrink.value,
    })
}

// 标签页
const activeName = ref('')
const editableTabs = reactive([])
// 处理标签点击
const handleTabClick = (tab) => {
    router.push(tab.paneName)
}
// 处理标签删除
const handleTabsEdit = (tabName, action) => {
    if (action !== 'remove') {
        return
    }
    // 点中tab的序号
    const clickIdx = editableTabs.findIndex(el => {
        return el.name === tabName
    })
    // 删除所点tab
    editableTabs.splice(clickIdx, 1)
    // 如果删除的不是当前正在激活的tab，不做后续处理
    if (tabName !== activeName.value) {
        return
    }
    // 优先激活后面的tab
    const active = editableTabs[clickIdx] ? editableTabs[clickIdx].name : editableTabs[clickIdx - 1].name
    router.push(active)
}

// 面包屑
const breadcrumbList = reactive([])

watch(() => route, (newV) => {
    // 配置面包屑
    const newBread = newV.matched.slice(1).map(el => {
        return el.meta.label
    })
    breadcrumbList.splice(0, breadcrumbList.length, ...newBread)

    // 激活tab
    activeName.value = newV.path
    // 当前路由标签中不存在，则添加进去
    const idx = editableTabs.findIndex(el => {
        return el.name === newV.path
    })
    if (idx === -1) {
        editableTabs.push({
            name: newV.path,
            label: newV.meta.label
        })
    }
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped>
.layout {
    .el-container {
        .menu-aside {
            height: 100vh;
            .sys-title {
                background-color: $color-menu-bg;
                text-align: center;
            }
        }

        .el-container {
            .el-header {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .shrink-icon {
                    cursor: pointer;
                    margin-right: 10px;
                }
            }

            .el-main {
                .tabs-wrap {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .el-tabs {
                        &:deep(.el-tabs__header) {
                            margin-bottom: 0px;
                        }
                    }
                }

            }
        }
    }
}
</style>