import request from '@/utils/request.js'

/**
 * 获取系统设置
 * @returns 
 */
export const getSetting = async () => {
    return request({
        url: '/setting/getSetting',
    })
}

/**
 * 保存系统设置
 * @param {*} params 
 * @returns 
 */
export const saveSetting = async (params) => {
    return request({
        url: '/setting/saveSetting',
        params,
    })
}