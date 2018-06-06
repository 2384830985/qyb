import request from './request'

//获取宝贝列表
export function getProductList(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/goods/List'
    })
    return request(config)
}

//下线宝贝
export function downLine(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/goods/downGoods'
    })
    return request(config)
}

//提交备注
export function setRemark(data = {}) {
    const config = Object.assign(data, {
        method: 'post',
        url: '/admin/goods/setRemark'
    })
    return request(config)
}

//审核宝贝
export function checkGoods(data = {}) {
    const config = Object.assign(data, {
        method: 'post',
        url: '/admin/goods/checkgoods'
    })
    return request(config)
}

//获取宝贝详细信息
export function getGoodsInfo(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/goods/GetGoodsInfo'
    })
    return request(config)
}

//修改宝贝信息
export function editGoods(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/goods/editGoods'
    })
    return request(config)
}

//获取宝贝分类列表
export function getCategoryList(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/goods/GetCategoryList'
    })
    return request(config)
}

//新增、修改宝贝分类列表
export function addCategory(data = {}) {
    const config = Object.assign(data, {
        method: 'get',
        url: '/admin/goods/AddCategory'
    })
    return request(config)
}