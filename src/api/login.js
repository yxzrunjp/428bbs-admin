import request from '@/utils/request.js'

export const login = async (params)=>{
    return request({
        url:'/login',
        params
    })
}