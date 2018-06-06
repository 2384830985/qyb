import request from './request'

export function getOrderList(data = {}) {
    const config = Object.assign(data, {
        method: 'post',
        url: '/admin/order/list'
    })
    return request(config)
}

export function deleteOrder(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/order/CancelOrder'
    })
    return request(config)
}

export function remarksOrder(data = {}) {
    const config = Object.assign(data, {
        method: 'post',
        url: '/admin/order/Remarks'
    })
    return request(config)
}

export function getOrderInfo(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/order/GetOrderInfo'
    })
    return request(config)
}

export function postSendOrderid(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/order/PostSendOrderid'
    })
    return request(config)
}

export function postSendGoods(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/asyn/SendGoods'
    })
    return request(config)
}