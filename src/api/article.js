import request from '@/utils/request.js'

/**
 * 获取文章列表
 * @param {*} params 
 * @returns 
 */
export const loadArticle = async (params) => {
    return request({
        url: '/forum/loadArticle',
        params,
        showLoading: false,
    })
}

/**
 * 修改文章板块
 * @param {*} params 
 * @returns 
 */
export const updateBoard = async (params) => {
    return request({
        url: '/forum/updateBoard',
        params,
    })
}

/**
 * 删除文章
 * @param {*} params 
 * @returns 
 */
export const delArticle = async (params) => {
    return request({
        url: '/forum/delArticle',
        params
    })
}

/**
 * 审核文章
 * @param {*} params 
 * @returns 
 */
export const auditArticle = async (params) => {
    return request({
        url: '/forum/auditArticle',
        params
    })
}

/**
 * 置顶文章
 * @param {*} params 
 * @returns 
 */
export const topArticle = async (params) => {
    return request({
        url: '/forum/topArticle',
        params
    })
}

/**
 * 获取附件信息
 * @param {*} params 
 * @returns 
 */
export const getAttachment = async (params) => {
    return request({
        url: '/forum/getAttachment',
        params
    })
}

/**
 * 获取文章评论
 * @param {*} params 
 * @returns 
 */
export const loadArticleComment = async (params) => {
    return request({
        url: '/forum/loadComment4Article',
        params
    })
}

/**
 * 获取所有评论
 * @param {*} params 
 * @returns 
 */
export const loadComment = async (params) => {
    return request({
        url: '/forum/loadComment',
        params,
        showLoading:false,
    })
}

/**
 * 删除评论
 * @param {*} params 
 * @returns 
 */
export const delComment = async (params)=>{
    return request({
        url: '/forum/delComment',
        params
    })
}

/**
 * 审核评论
 * @param {*} params 
 * @returns 
 */
export const auditComment = async (params)=>{
    return request({
        url: '/forum/auditComment',
        params
    })
}