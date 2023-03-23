import { defineStore } from 'pinia'

export const usePagePxStore = defineStore('pagePx', {
    state() {
        return {
            headerHeight: 50,//页头高度
            isShrink: false,//导航菜单是否缩小
        }
    },
    actions: {

    },
    getters: {
        asideWidth: (state) => {
            return state.isShrink ? 63 : 200
        }
    }
})