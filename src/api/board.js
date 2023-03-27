import request from '@/utils/request.js'

/**
 * 获取所有板块信息
 * @returns 
 */
export const loadBoard = async ()=>{
    return request({
        url:'/board/loadBoard',
    })
}