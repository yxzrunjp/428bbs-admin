<template>
    <div class="comment-item">
        <div class="left">
            <Avatar :userId="data.userId" :size="50"></Avatar>
        </div>
        <div class="right">
            <div class="nickname-wrap">
                <a class="text-btn" :href="`${globalInfo.clientAddress}/user/${data.userId}`" target="_blank">
                    {{ data.nickName }}
                </a>
            </div>
            <div class="comment-content">
                <div class="content">{{ data.content }}</div>
                <div class="content-img" v-if="data.imgPath">
                    <Cover :url="`${globalInfo.getImageUrl}/${data.imgPath.replace('.', '_.')}`" />
                </div>
            </div>
            <div class="other-info">
                <span>{{ data.postTime }}</span>
                <span class="space">·</span>
                <span>{{ data.userIpAddress }}</span>
                <span class="space">
                    <i class="iconfont icon-good"></i>
                    {{ data.goodCount }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
const globalInfo = inject('globalInfo')
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

</script>

<style lang="scss" scoped>
.comment-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px 0 0px;

    .left {
        margin-right: 10px;
    }

    .right {
        flex: 1;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;

        .comment-content {
            margin: 8px 0;

            .content-img {
                margin-top: 6px;
            }
        }



        .nickname-wrap,
        .other-info {
            color: $color-font;
            font-size: 14px;
        }

        .space {
            margin: 0 8px;
        }

        .other-info {
            i {
                margin-right: 4px;
            }
        }
    }
}
</style>