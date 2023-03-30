import request from '@/utils/request.js'

/**
 * 获取所有板块信息
 * @returns 
 */
export const loadBoard = async () => {
    return request({
        url: '/board/loadBoard',
        showLoading:false,
    })
}

/**
 * 保存板块
 * @param {*} params 
 * @returns 
 */
export const saveBoard = async (params) => {
    return request({
        url: '/board/saveBoard',
        params,
        dataType: 'file',
    })
}

/**
 * 删除板块
 * @param {*} params 
 * @returns 
 */
export const delBoard = async (params) => {
    return request({
        url:'/board/delBoard',
        params,
    })
}

/**
 * 修改板块排序
 * @param {*} params 
 * @returns 
 */
export const changeBoardSort = async (params)=>{
    return request({
        url:'/board/changeBoardSort',
        params,
        showLoading:false,
    })
}