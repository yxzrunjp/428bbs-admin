<template>
    <el-menu :collapse="isShrink" :collapse-transition="false" :default-openeds="defaultOpen" :default-active="menuActive"
        :active-text-color="'#ff4757'" :background-color="'#ddd'" class="sys-menu">
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
                    <!-- <i v-if="isShrink" :class="['iconfont', menu.meta.icon]"></i> -->
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
// 配置菜单默认展开
const defaultOpenList = []
MenuList.forEach(el => {
    if (el.children) {
        defaultOpenList.push(`/${el.path}`)
    }
})

const defaultOpen = reactive(defaultOpenList)
const menuActive = ref('/forum/article')
const menuList = reactive(MenuList)


watch(() => route.path, (newV) => {
    // 设置激活的路由
    menuActive.value = newV
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped></style>