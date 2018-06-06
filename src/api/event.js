import request from './request'

//新增、修改拼团活动
export function subEvent(data = {}) {
    const config = Object.assign(data, {
        method: 'post',
    })
    return request(config)
}

//获取拼团活动信息
export function getEditInfo(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/Regiment/EditInfo'
    })
    return request(config)
}

//获取拼团列表
export function getEventList(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/Regiment/list'
    })
    return request(config)
}

//删除活动
export function delEvent(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/Regiment/Delete'
    })
    return request(config)
}

//上线活动
export function upLine(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/Regiment/UpRegiment'
    })
    return request(config)
}

//上传图片
export function upLoadPic(data = {}) {
    const config = Object.assign(data, {
        method: 'post',
        url: '/admin/common/UploadImg',
        headers: {'Content-Type': 'multipart/form-data'}
    })
    return request(config)
}
