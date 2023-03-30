<template>
    <Dialog :width="'600px'" :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons">
        <div class="comment-list">
            <CommentItem v-for="item in commentList" :key="item.commentId" :data="item" />
        </div>
    </Dialog>
</template>

<script setup>
import CommentItem from './CommentItem.vue';
import { reactive, ref, inject } from 'vue';

import { loadArticleComment } from '@/api/article.js'
const globalInfo = inject('globalInfo')

const dialogConfig = reactive({
    show: false,
    title: '评论信息',
    buttons: [
        {
            type: 'primary',
            text: '关闭',
            click: () => {
                closeCommentInfo()
            }
        }
    ],
})

const articleId = ref('')
const commentList = reactive([])
const getCommentInfo = async () => {
    const params = {
        articleId: articleId.value,
        // pageNo: commentList.pageNo,
        // pageSize: commentList.pageSize
    }
    const result = await loadArticleComment(params)
    if (!result) {
        return
    }
    commentList.splice(0,commentList.length,...result.data)
}

const showCommentInfo = (data) => {
    articleId.value = data.articleId
    dialogConfig.show = true
    getCommentInfo()
}
const closeCommentInfo = () => {
    dialogConfig.show = false
}
defineExpose({
    showCommentInfo
})
</script>

<style lang="scss" scoped>
.user-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .nickname {
        margin-left: 10px;
    }
}
</style>