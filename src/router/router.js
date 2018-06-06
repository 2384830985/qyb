/*
* 配置路由及左侧菜单信息
* path: 路由path
* name: 路由名称
* icon: 菜单图标
* title: 菜单名称+页面title
* components: 页面组件
*/

const event = {
    path: '/event',
    name: 'event',
    icon: 'el-icon-date',
    meta: {
        title: '活动管理'
    },
    component: () => import('@/pages/index/index.vue'),
    children: [
        {
            path: '/event/addevent',
            name: 'event_addevent',
            meta: {
                title: '新建活动'
            },
            component: () => import('@/pages/event/add-event.vue')
        },
        {
            path: '/event/editevent/:id',
            name: 'event_editevent',
            hidden: true,
            meta: {
                title: '编辑活动'
            },
            component: () => import('@/pages/event/edit-event.vue')
        },
        {
            path: '/event/copyevent/:id',
            name: 'event_copyevent',
            hidden: true,
            meta: {
                title: '赋值活动'
            },
            component: () => import('@/pages/event/copy-event.vue')
        },
        {
            path: '/event/checklist',
            name: 'event_checklist',
            meta: {
                title: '待审核活动列表',
                checkNum: 'regiment_check_num'
            },
            component: () => import('@/pages/event/check-list.vue')
        },
        {
            path: '/event/timinglist',
            name: 'event_timinglist',
            meta: {
                title: '定时上线活动列表'
            },
            component: () => import('@/pages/event/timing-list.vue')
        },
        {
            path: '/event/onlinelist',
            name: 'event_onlinelist',
            meta: {
                title: '上线活动列表'
            },
            component: () => import('@/pages/event/online-list.vue')
        },
        {
            path: '/event/endlinelist',
            name: 'event_endlinelist',
            meta: {
                title: '下线活动列表'
            },
            component: () => import('@/pages/event/endline-list.vue')
        }
    ]
}

const product = {
    path: '/product',
    name: 'product',
    icon: 'el-icon-goods',
    meta: {
        title: '宝贝管理'
    },
    component: () => import('@/pages/index/index.vue'),
    children: [
        {
            path: '/product/checklist',
            name: 'product_checklist',
            meta: {
                title: '待审核列表',
                checkNum: 'goods_check_num'
            },
            component: () => import('@/pages/product/check-list.vue')
        },
        {
            path: '/product/onlinelist',
            name: 'product_onlinelist',
            meta: {
                title: '上线列表'
            },
            component: () => import('@/pages/product/online-list.vue')
        },
        {
            path: '/product/managelist',
            name: 'product_managelist',
            meta: {
                title: '宝贝管理列表'
            },
            component: () => import('@/pages/product/manage-list.vue')
        },
        {
            path: '/product/typelist',
            name: 'product_typelist',
            meta: {
                title: '宝贝分类列表'
            },
            component: () => import('@/pages/product/type-list.vue')
        },
        {
            path: '/product/detail/:id',
            name: 'product_detail',
            hidden: true,
            meta: {
                title: '宝贝详情'
            },
            component: () => import('@/pages/product/product-detail.vue')
        }
    ]
}

const order = {
    path: '/order',
    name: 'order',
    icon: 'el-icon-tickets',
    meta: {
        title: '订单管理'
    },
    component: () => import('@/pages/index/index.vue'),
    children: [
        {
            path: '/order/managelist',
            name: 'order_managelist',
            meta: {
                title: '订单管理'
            },
            component: () => import('@/pages/order/manage-list.vue')
        },
        {
            path: '/order/detail/:orderid',
            name: 'order_detail',
            hidden: true,
            meta: {
                title: '订单详情'
            },
            component: () => import('@/pages/order/detail.vue')
        }
    ]
}

const routes = [
    {
        path: '/',
        hidden: true,
        redirect: '/product/onlinelist'
    },
    {
        path: '/login',
        name: 'login',
        hidden: true,
        meta: {
            title: '登录'
        },
        component: () => import('@/pages/login/login.vue')
    },
    {
        path: '/error403',
        name: 'error-403',
        hidden: true,
        meta: {
            title: '权限不足'
        },
        component: () => import('@/pages/error/error-403.vue')
    },
    product,
    event,
    order,
    {
        path: '*',
        name: 'error-404',
        hidden: true,
        meta: {
            title: '找不到该页面'
        },
        component: () => import('@/pages/error/error-404.vue')
    }
]

export default routes