import { defineStore } from 'pinia'

export const usePagePxStore = defineStore('pagePx', {
    state() {
        return {
            headerHeight: 50,//页头高度
            isShrink: false,//导航菜单是否缩小
            tabsHeight:50,//tabs标签高度
        }
    },
    actions: {

    },
    getters: {
        asideWidth: (state) => {
            return state.isShrink ? 63 : 200
        },
        headerAndMenuHeight:(state)=>{
            // 40属于el-main的上下padding之和
            return state.headerHeight+state.tabsHeight + 40
        }
    }
})