<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import znCn from 'element-plus/lib/locale/lang/zh-cn'
import { reactive, provide, readonly } from 'vue'

const locale = znCn
const config = reactive({
  max: 1,
})

const globalInfo = readonly({
  avatarUrl: '/api/file/getAvatar',
  getImageUrl:'/api/file/getImage',
  attachmentDownloadUrl:'/api/forum/attachmentDownload',
  clientAddress:'http://localhost:3000',
})

provide('globalInfo', globalInfo)
// provide('pagePxStore', pagePxStore)
</script>

<style lang="scss" scoped></style>