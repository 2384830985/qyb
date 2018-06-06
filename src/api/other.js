import request from './request'

export function getQrcode(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/common/GetWxcodeQrcode'
    })
    return request(config)
}

export function getCheckNum(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/common/GetCheckNum'
    })
    return request(config)
}