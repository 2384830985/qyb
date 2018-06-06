<template>
    <div class="order-manage-wrap">
        <div class="page-header">
            <h3>
                <a href="javascript:;"
                   v-for="(item,index) in type_list"
                   :key="index"
                   :class="(index===current_type)?'on':''"
                   @click="chooseType(index,item.status)"
                >{{item.name}}</a>
            </h3>
        </div>
        <div class="search-wrap mt30">
            <el-form class="flex-between flex-wrap"
                     ref="search"
                     :form="params.search"
                     label-width="100px"
                     :inline="true"
                     label-position="left"
                     style="align-items: flex-start;">
                <el-form-item label="订单号:">
                    <el-input v-model="params.search.orderid" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="宝贝名称:">
                    <el-input v-model="params.search.title" placeholder="请输入宝贝名称"></el-input>
                </el-form-item>
                <el-form-item label="收货人姓名:">
                    <el-input v-model="params.search.name" placeholder="请输入收货人姓名"></el-input>
                </el-form-item>
                <el-form-item label="收货人手机:">
                    <el-input v-model="params.search.tel" placeholder="请输入收货人手机"></el-input>
                </el-form-item>
                <el-form-item label="发件人姓名:">
                    <el-input v-model="params.search.merchant_name" placeholder="请输入发件人姓名"></el-input>
                </el-form-item>
                <el-form-item label="发件人手机:">
                    <el-input v-model="params.search.merchant_tel" placeholder="请输入发件人手机"></el-input>
                </el-form-item>
                <template>
                    <el-form-item label="下单时间:">
                        <el-date-picker
                                class="mr20"
                                v-model="order_time"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                        <el-button
                                v-for="(item,index) in recen_time_list"
                                :key="index"
                                @click="chooseRecenTime(item.status)"
                                type="text">{{item.name}}
                        </el-button>
                    </el-form-item>
                </template>
                <el-button class="mb20" type="primary" @click="_getOrderList">筛选</el-button>
            </el-form>
        </div>
        <div class="list-status Z-row">
            <span v-for="(item,index) in status_list"
                  :key="index"
                  :class="(index===current_status)?'on':''"
                  @click="chooseStatus(item.status,index)"
            >{{item.name}}</span>
        </div>
        <el-row :class="{'table-header-fixed-wrap':tableHeaderFixed}" ref="tableHeader">
            <el-row class="table-header tc">
                <el-col class="tl" :span="9">宝贝信息</el-col>
                <el-col :span="3">
                    <el-button type="text" @click="sortOrderList">下单时间{{Boolean(params.sort) ? '↑' : '↓'}}
                    </el-button>
                </el-col>
                <el-col :span="4">订单状态</el-col>
                <el-col :span="4">发件信息</el-col>
                <el-col :span="4">收件信息</el-col>
            </el-row>
        </el-row>
        <el-row class="table-header tc" v-show="tableHeaderFixed"></el-row>
        <div class="list"
             v-loading="isLoading"
             element-loading-text="拼命加载中">
            <ul>
                <li v-for="(item,index) in orderList" :key="index">
                    <div class="item-header flex-between">
                        <span>订单号：{{item.orderid}}</span>
                        <div class="actions">
                            <el-tooltip content="发货"
                                        placement="top"
                                        v-if="item.status==='3' && item.type==='3'">
                                <el-button icon="font-icon-express" size="small" circle
                                           @click="openExpressNumber(item)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="发货"
                                        placement="top"
                                        v-if="item.status=='3' && item.type!=='3' && is_dev==1">
                                <el-button icon="font-icon-express"
                                           size="small"
                                           circle
                                           @click="sendGoods(item.orderid)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="查看详情"
                                        placement="top">
                                <el-button icon="el-icon-tickets" size="small" circle
                                           @click="$router.push(`/order/detail/${item.orderid}`)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="取消订单"
                                        placement="top"
                                        v-if="['1','2','3','4'].includes(item.status)">
                                <el-button icon="el-icon-close" size="small" circle
                                           @click="cancelOrder(item)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="备注"
                                        placement="top">
                                <el-button icon="font-icon-remark" size="small" circle
                                           @click="openRemarkLayer(item.remarks,item.orderid)"></el-button>
                            </el-tooltip>
                        </div>
                    </div>
                    <el-row class="item-content">
                        <el-col class="item-img" :span="9">
                            <router-link
                                    :to="item.type==='3'?`/event/editevent/${item.goods_id}`:`/product/detail/${item.goods_id}`"
                                    target="_blank"
                                    class="blue">
                                <div class="img">
                                    <img v-lazy="`${item.goods_img}/230x230`" alt="">
                                </div>
                                <div class="item-goods-name">
                                    <span v-if="item.type==='1'" class="bg-tag red">一口价</span>
                                    <span v-else-if="item.type==='2'" class="blue bg-tag">竞拍</span>
                                    <span v-else class="bg-tag green">拼团就送</span>
                                    {{item.goods_title}}
                                </div>
                            </router-link>
                        </el-col>
                        <el-col :span="3">{{item.add_time}}</el-col>
                        <el-col :span="4">{{getOrderStatusText(item.status)}}</el-col>
                        <el-col class="ft12" :span="4" v-if="item.type!=='3'">
                            <p>{{item.merchant_address && item.merchant_address.username}}</p>
                            <p>{{item.merchant_address && item.merchant_address.tel}}</p>
                            <p class="mt10">
                                {{item.merchant_address && item.merchant_address.province + item.merchant_address.city + item.merchant_address.area + item.merchant_address.address}}</p>
                        </el-col>
                        <el-col class="ft12" :span="4" v-else>平台发货</el-col>
                        <el-col class="ft12" :span="4">
                            <p>{{item.address.username}}</p>
                            <p>{{item.address.tel}}</p>
                            <p class="mt10">
                                {{item.address.province + item.address.city + item.address.area + item.address.address}}</p>
                        </el-col>
                    </el-row>
                    <div v-if="item.remarks" class="item-bottom">备注：{{item.remarks}}</div>
                </li>
                <el-row class="red mt20" v-if="!isLoading && !orderList.length">暂时没有订单...</el-row>
            </ul>
            <el-row class="mt30 tc" v-if="count>size">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :background="true"
                        :current-page="params.page"
                        :page-size="size"
                        layout="total, prev, pager, next, jumper"
                        :total="count">
                </el-pagination>
            </el-row>
        </div>
        <CancelOrder :isShow.sync="cancelOrderShow" :orderInfo="orderInfo" @subCancelOrderLayer="_getOrderList"/>
        <SendExpress :isShowSend.sync="isShowSend" :orderInfo="orderInfo" @refrashList="_getOrderList"/>
    </div>
</template>

<script>
    import {getOrderList, remarksOrder, postSendGoods} from '@/api/order'
    import CancelOrder from './components/cancel_order'
    import SendExpress from './components/send_Express'
    import qs from 'qs'

    //status 1待付款 2卖家支付押金 3待发货 4已发货 5已完成 -1删除 -3已取消 -4买家超时 -5卖家超时
    export default {
        data() {
            return {
                isShowSend: false,
                isLoading: false,
                cancelOrderShow: false,
                orderInfo: null,
                count: '',
                size: '',
                order_time: [],
                current_type: 0,
                current_status: 0,
                sortOrderTime: false,
                tableHeaderFixed: false,
                is_dev: '',
                orderList: [],
                params: {
                    sort: '',
                    page: 1,
                    type: '',
                    status: '',
                    recen_time: '',
                    search: {
                        id: '',
                        orderid: '',
                        title: '',
                        name: '',
                        tel: '',
                        merchant_name: '',
                        merchant_tel: '',
                        start_time: '',
                        end_time: ''
                    }
                },
                type_list: [
                    {name: '全部订单', status: '0'},
                    {name: '拼团订单', status: '3'},
                    {name: '一口价订单', status: '1'},
                    {name: '竞拍订单', status: '2'}
                ],
                status_list: [
                    {name: '全部', status: '0'},
                    {name: '待付款', status: '1'},
                    {name: '待发货', status: '3'},
                    {name: '已发货', status: '4'},
                    {name: '已完成', status: '5'},
                    {name: '已关闭', status: '-4'},
                    {name: '已取消', status: '-3'}
                ],
                recen_time_list: [
                    {name: '今天', status: '1'},
                    {name: '近3天', status: '3'},
                    {name: '近7天', status: '7'}
                ]
            }
        },
        created() {
            this._getQuery()
            this._getOrderList()
        },
        mounted() {
            const tableHeaderTop = this.$refs['tableHeader'].$el.offsetTop
            window.onscroll = () => {
                const scrollTop = document.querySelector('html,body').scrollTop
                if (scrollTop > tableHeaderTop) {
                    this.tableHeaderFixed = true
                } else {
                    this.tableHeaderFixed = false
                }
            }
        },
        destroyed() {
            window.onscroll = ''
        },
        methods: {
            //获取查询参数
            _getQuery() {
                this.params.search.id = this.$route.query.id
                this.params.type = this.$route.query.type
                this.type_list.forEach((item, idx) => {
                    (item.status === this.params.type) && (this.current_type = idx)
                })
            },
            //获取订单列表
            _getOrderList() {
                this.isLoading = true
                if (this.order_time && this.order_time.length) {
                    this.params.search.start_time = this.order_time[0]
                    this.params.search.end_time = this.order_time[1]
                }
                const searchData = {
                    data: qs.stringify(this.params)
                }
                getOrderList(searchData).then(res => {
                    this.isLoading = false
                    if (res.resultCode === '0') {
                        this.orderList = res.result.data
                        this.count = parseInt(res.result.count)
                        this.size = parseInt(res.result.size)
                        this.params.recen_time = ''
                        this.params.search.id = ''
                        this.is_dev = res.result.is_dev
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            },
            //点击type切换
            chooseType(index, type) {
                this.current_type = index
                this.params.type = type
                this._getOrderList()
            },
            //点击status切换
            chooseStatus(status, index) {
                this.current_status = index
                this.params.status = status
                this._getOrderList()
            },
            //点击最近时间快捷搜索
            chooseRecenTime(status) {
                this.params.recen_time = status
                const et = new Date()
                const st = new Date(et.getTime() - status * 86400 * 1000)
                this.order_time = [st, et]
                this._getOrderList()
            },
            //按下单时间排序
            sortOrderList() {
                if (this.params.sort) {
                    this.params.sort = ''
                } else {
                    this.params.sort = 1
                }
                this._getOrderList()
            },
            //翻页
            handleCurrentChange(val) {
                this.params.page = val
                this._getOrderList()
            },
            //打开快递单号弹窗
            openExpressNumber(orderInfo) {
                this.isShowSend = true
                this.orderInfo = orderInfo
            },
            //测试环境一口价、竞拍发货
            sendGoods(orderid) {
                const params = {
                    orderid: orderid
                }
                postSendGoods({
                    params: params
                }).then(res => {
                    this.$message.success('发货成功')
                    this._getOrderList()
                })
            },
            //备注
            openRemarkLayer(remarks, orderid) {
                this.$prompt('', remarks ? '修改备注' : '添加备注', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                    inputValue: remarks || '',
                }).then(({value}) => {
                    const data = {
                        orderid: orderid,
                        remarks: value
                    }
                    remarksOrder({
                        data: qs.stringify(data)
                    }).then(res => {
                        if (res.resultCode === '0') {
                            this.$message.success(res.errorMsg)
                            this._getOrderList()
                        } else {
                            this.$message.error(res.errorMsg)
                        }
                    })
                }).catch(() => {
                })
            },
            //取消订单
            cancelOrder(orderInfo) {
                this.cancelOrderShow = true
                this.orderInfo = {
                    type: orderInfo.type,
                    orderid: orderInfo.orderid,
                    statusText: this.getOrderStatusText(orderInfo.status)
                }
            },
            //订单状态对应关系
            getOrderStatusText(status) {
                switch (status) {
                    case '1':
                        return '等待买家支付运费'
                    case '2':
                        return '等待卖家支付押金'
                    case '3':
                        return '卖家已支付押金'
                    case '4':
                        return '已发货'
                    case '5':
                        return '已完成'
                    case '-1':
                        return '已删除'
                    case '-3':
                        return '已取消'
                    case '-4':
                        return '买家超时未支付,已关闭'
                    case '-5':
                        return '卖家超时未支付，已关闭'
                }
            }
        },
        components: {
            CancelOrder,
            SendExpress
        }
    }
</script>

<style lang="less">

    .order-manage-wrap {
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #dcdfe6;
            height: 50px;
            line-height: 50px;
            h3 {
                a {
                    margin-right: 30px;
                    font-size: 18px;
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 42px;
                    border-bottom: 4px solid transparent;
                    &.on {
                        color: #FC6B6B;
                        border-bottom-color: #FC6B6B;
                    }
                }
            }
        }
        .list-status {
            font-size: 0;
            span {
                font-size: 14px;
                display: inline-block;
                width: 78px;
                height: 38px;
                line-height: 38px;
                background-color: #F2F2F2;
                border: 1px solid #D9D9D9;
                text-align: center;
                cursor: pointer;
                border-right: none;
                &:last-child {
                    border-right: 1px solid #D9D9D9;
                }
                &.on {
                    color: #FC6B6B;
                    background-color: #fff;
                    border-bottom-color: #fff;
                }
            }
        }
        .table-header-fixed-wrap {
            min-width: 1200px;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 100px 0 356px;
            z-index: 5;
            .table-header {
                max-width: 1220px;
                min-width: 780px;
                margin: 0 auto;
            }
        }
        .table-header {
            height: 38px;
            line-height: 38px;
            background-color: #F2F2F2;
            border: 1px solid #D9D9D9;
            .el-col {
                padding: 0 10px;
                box-sizing: border-box;
            }
        }
        .list {
            min-height: 500px;
            ul {
                li {
                    margin: 20px 0;
                    border: 1px solid #D9D9D9;
                    text-align: center;
                    .item-header {
                        padding: 0 10px;
                        line-height: 38px;
                        background-color: #F2F2F2;
                        border-bottom: 1px solid #D9D9D9;
                    }
                    .item-content {
                        display: flex;
                    }
                    .el-col {
                        padding: 20px 10px;
                        border-right: 1px solid #D9D9D9;
                        &:last-of-type {
                            border: none;
                        }
                    }
                    .item-img {
                        .img {
                            width: 100px;
                            height: 100px;
                            float: left;
                            overflow: hidden;
                            img {
                                width: 100%;
                                transition: all .5s ease-out .1s;
                            }
                            &:hover {
                                img {
                                    transform: scale(1.1);
                                }
                            }
                        }
                    }
                    .item-goods-name {
                        margin-left: 110px;
                        word-break: break-all;
                        text-align: left;
                    }
                    .item-bottom {
                        line-height: 34px;
                        border-top: 1px solid #D9D9D9;
                        background-color: #FFFAEB;
                        color: #FF9C12;
                        padding: 0 10px;
                        text-align: left;
                    }
                }
            }
        }
    }
</style>