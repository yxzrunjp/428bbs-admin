<template>
    <!-- :unique-opened="true" 默认展开一个菜单 -->
    <el-menu :collapse="isShrink" :collapse-transition="false" :default-openeds="defaultOpen" :default-active="menuActive"
        class="sys-menu">
        <!-- 一级 -->
        <template v-for="menu in menuList" :key="menu.path">
            <el-sub-menu v-if="menu.children" :index="'/' + menu.path">
                <template #title>
                    <i :class="['iconfont', menu.meta.icon]"></i>
                    <span>{{ menu.meta.label }}</span>
                </template>

                <router-link v-for="sub in menu.children" :key="sub.path" :to="{ path: `/${menu.path}/${sub.path}` }">
                    <el-menu-item :index="'/' + menu.path + '/' + sub.path">
                        {{ sub.meta.label }}
                    </el-menu-item>
                </router-link>
            </el-sub-menu>

            <router-link v-else :to="'/' + menu.path">
                <el-menu-item :index="'/' + menu.path">
                    <i v-if="isShrink" :class="['iconfont', menu.meta.icon]"></i>
                    <template #title>
                        <i :class="['iconfont', menu.meta.icon]"></i>
                        <span>{{ menu.meta.label }}</span>
                    </template>

                </el-menu-item>
            </router-link>
        </template>
    </el-menu>
</template>
<script setup>
import { MenuList } from '@/utils/setting.js'
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePagePxStore } from '@/stores/pagePx.js'

const route = useRoute()

const pagePxStore = usePagePxStore()
const { isShrink } = storeToRefs(pagePxStore)

const defaultOpenList = []
MenuList.forEach(el => {
    // 配置菜单默认全部展开
    if (el.children) {
        defaultOpenList.push(`/${el.path}`)
    }
    // 默认展开第一个
    // if (el.children&&defaultOpenList.length === 0) {
    //     defaultOpenList.push(`/${el.path}`)
    // }
})

const defaultOpen = reactive(defaultOpenList)
const menuActive = ref('/forum/article')
const menuList = reactive(MenuList)


watch(() => route.path, (newV) => {
    // 设置激活的路由
    menuActive.value = newV
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped>
.sys-menu {
    background-color: $color-menu-bg;
    height: calc(100% - 50px);
    border-right: none;
    .el-sub-menu {
        i {
            margin-right: 10px;
        }

        // :deep(.el-sub-menu__title) {
        //     &:hover {
        //         background-color: #ffb;
        //     }
        // }

    }

    .el-menu-item {
        background-color: $color-menu-item-bg;


        i {
            margin-right: 10px;
        }


        &:hover {
            background-color: $color-menu-bg;
        }
    }

    .el-menu-item.is-active {
        color:$color-dark-blue;
    }
}
</style>