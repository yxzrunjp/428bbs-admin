import request from '@/utils/request.js'

/**
 * 获取用户列表
 * @param {*} params 
 * @returns 
 */
export const loadUserList = async (params) => {
    return request({
        url: '/user/loadUserList',
        params,
        showLoading: false,
    })
}

/**
 * 更新用户状态
 * @param {*} params 
 * @returns 
 */
export const updateUserStatus = async (params) => {
    return request({
        url: '/user/updateUserStatus',
        params,
    })
}

/**
 * 给用户发送系统消息
 * @param {*} params 
 * @returns 
 */
export const sendMessage = async (params) => {
    return request({
        url: '/user/sendMessage',
        params,
    })
}