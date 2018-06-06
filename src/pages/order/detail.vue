<template>
    <div class="order-detail-wrap" v-if="order">
        <div class="page-header">
            <h3>订单详情</h3>
            <div class="control">
                <el-tooltip content="返回"
                            placement="top">
                    <el-button icon="font-icon-back"
                               size="small"
                               circle
                               @click="$router.go(-1)"></el-button>
                </el-tooltip>
                <el-tooltip content="发货"
                            placement="top"
                            v-if="order.order.status==='3'&&order.order.type==='3'">
                    <el-button icon="font-icon-express" size="small" circle
                               @click="openExpressNumber(order.order)"></el-button>
                </el-tooltip>
                <el-tooltip content="取消订单"
                            placement="top"
                            v-if="['1','2','3','4'].includes(order.order.status)">
                    <el-button icon="el-icon-close"
                               size="small"
                               circle
                               @click="cancelOrder(order.order)"></el-button>
                </el-tooltip>
                <el-tooltip content="备注"
                            placement="top">
                    <el-button icon="font-icon-remark"
                               size="small"
                               circle
                               @click="openRemarkLayer(order.order.remarks,order.order.orderid)"></el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="page-content">
            <div class="Z-row bd pd20">
                <Steps :type="order.order.type"
                       :status="order.order.status"
                       :send_type="order.order.send_type"
                       :order_time="order.order_time"/>
            </div>
            <div class="remark" v-if="order.order.remarks">备注：{{order.order.remarks}}</div>
            <div class="Z-row bd pd20 flex-between" style="align-items: flex-start;">
                <div class="left-content pr20">
                    <div class="Z-row b ft16 mt0">订单信息</div>
                    <div class="Z-row">
                        <span class="Z-name">订单号：</span>{{order.order.orderid}}
                    </div>
                    <div class="Z-row" v-if="order.order.send_orderid">
                        <span class="Z-name">快递单号：</span>{{order.order.send_orderid}}
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">订单类型：</span>{{orderType}}
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">订单状态：</span>{{orderStatus}}
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">交付方式：</span>{{order.order.send_company}}
                    </div>
                    <div class="Z-row"><span class="Z-name">成交钻石：</span>{{order.order.diamond_num}}钻</div>
                </div>
                <div class="right-content pr20 pl20"
                     style="border-left: 1px dashed #D9D9D9;"
                     v-if="order.order.type==='3'">
                    <div class="Z-row b ft16 mt0">收货信息</div>
                    <div class="Z-row"><span class="Z-name">用户名：</span>{{order.order.qyb_name}}</div>
                    <div class="Z-row"><span class="Z-name">联系人：</span>{{order.order.address.username}}</div>
                    <div class="Z-row"><span class="Z-name">联系方式：</span>{{order.order.address.tel}}</div>
                    <div class="Z-block-row">
                        <span class="Z-name">收件地址：</span>
                        <div class="Z-content">
                            {{order.order.address.province + order.order.address.city + order.order.address.area + order.order.address.address}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="Z-row bd pd20 flex-between"
                 style="align-items: flex-start;"
                 v-if="order.order.type!=='3'">
                <div class="left-content pr20">
                    <div class="Z-row b ft16 mt0">卖家信息</div>
                    <div class="Z-row">
                        <span class="Z-name">用户名：</span>{{order.order.qyb_merchant_name && order.order.qyb_merchant_name}}
                    </div>
                    <div class="Z-row" v-if="order.order.send_type === '2'">
                        <span class="Z-name">支付押金：</span>{{order.order.merchant_deposit && order.order.merchant_deposit}}
                    </div>
                    <div class="Z-row" v-if="order.order.send_type === '2'">
                        <span class="Z-name">支付单号：</span>{{order.order.merchant_orderid && order.order.merchant_orderid}}
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">联系人：</span>{{order.order.merchant_address && order.order.merchant_address.username}}
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">联系方式：</span>{{order.order.merchant_address && order.order.merchant_address.tel}}
                    </div>
                    <div class="Z-block-row">
                        <span class="Z-name">{{order.order.send_type === '1' ? '提件地址：' : '寄件地址：'}}</span>
                        <div class="Z-content">
                            {{order.order.merchant_address && order.order.merchant_address.province + order.order.merchant_address.city + order.order.merchant_address.area + order.order.merchant_address.address}}
                        </div>
                    </div>
                </div>
                <div class="right-content pr20 pl20" style="border-left: 1px dashed #D9D9D9;">
                    <div class="Z-row b ft16 mt0">买家信息</div>
                    <div class="Z-row">
                        <span class="Z-name">用户名：</span>{{order.order.qyb_name}}
                    </div>
                    <div class="Z-row" v-if="order.order.send_type === '2'">
                        <span class="Z-name">快递费：</span>{{order.order.send_price}}
                    </div>
                    <div class="Z-row" v-if="order.order.send_type === '2'">
                        <span class="Z-name">支付单号：</span>{{order.order.user_orderid}}
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">联系人：</span>{{order.order.address.username}}
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">联系方式：</span>{{order.order.address.tel}}
                    </div>
                    <div class="Z-block-row" v-if="order.order.send_type==='2'">
                        <span class="Z-name">收件地址：</span>
                        <div class="Z-content">
                            {{order.order.address.province + order.order.address.city + order.order.address.area + order.order.address.address}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="Z-row product-card">
                <router-link
                        :to="order.order.type==='3'?`/event/editevent/${order.goods.id}`:`/product/detail/${order.goods.id}`"
                        target="_blank">
                    <div class="list-item" v-if="order.order.type!=='3'">
                        <div class="img">
                            <img v-lazy="`${order.goods.cover}/230x230`">
                            <div class="video-shadow" v-if="order.goods.is_video==='1'">
                                <i class="el-icon-caret-right"></i>
                            </div>
                            <div class="send" v-if="order.goods.is_finish==='1'">已送出</div>
                        </div>
                        <div class="content">
                            <div class="title lh20">
                                <span class="bg-tag red mr10" v-if="order.goods.type==='1'">一口价</span>
                                <span class="bg-tag blue mr10" v-else>竞拍</span>
                                <strong>{{order.goods.title}}</strong>
                                <span class="space-bg-tag green ml10" v-if="order.goods.is_new==='1'">全新宝贝</span>
                                <span class="gray ft12 r">{{order.goods.add_time}}</span>
                            </div>
                            <div class="desc">
                                <span class="space-tag mr20">{{order.goods.is_big === '1' ? '大件' : '小件'}}</span>
                                <span class="mr20">{{order.goods.category}}</span>
                                <span class="mr20" v-if="order.goods.type==='1'">一口价：<i
                                        class="red">{{order.goods.price}} 钻</i></span>
                                <span class="mr20" v-else>起拍价：<i class="red">{{order.goods.price}} 钻</i></span>
                                <span class="mr20" v-if="order.goods.auction_hour!=='0'">竞拍时间：{{order.goods.auction_hour}}小时</span>
                                <span class="mr20" v-if="order.goods.left_time">倒计时：{{order.goods.left_time}}</span>
                                <span class="mr20" v-if="order.goods.final_price">成交价：{{order.goods.final_price}}</span>
                            </div>
                            <div class="desc">
                                <span class="mr20">联系方式：{{order.goods.address.name}}</span>
                                <span class="mr20">{{order.goods.address.tel}}</span>
                            </div>
                            <div class="desc" style="line-height: 32px">
                                <span class="mr20">取件地址：{{`${order.goods.address.province}${order.goods.address.city}${order.goods.address.county}${order.goods.address.detail}`}}</span>
                                <div class="r">
                                    <el-tooltip content="小程序码"
                                                placement="top">
                                        <el-button icon="font-icon-qrcode" size="small" circle
                                                   @click.prevent="openrcodeLayer(order.goods.id)"></el-button>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-item" v-else>
                        <div class="img">
                            <img :src="`${order.goods.cover}/230x230`" alt="">
                        </div>
                        <div class="content">
                            <div class="title lh20">
                                <strong>{{order.goods.title}}</strong>
                                <span class="gray ft12 r">{{order.goods.add_time}}</span>
                            </div>
                            <div class="desc">
                                <div>
                                    <span>兑换需：{{order.goods.need_price}}钻</span>
                                    <span class="ml20">库存：{{`${order.goods.left_count}/${order.goods.store_nums}`}}</span>
                                    <span class="ml20">{{order.goods.need_num}}人团</span>
                                    <span class="ml20">活动结束时间：{{order.goods.end_time}}</span>
                                </div>
                            </div>
                            <div class="desc" style="line-height: 32px">
                                <div class="gray l">
                                    <span>拼团成功数：{{order.goods.teamwork_num}}</span>
                                    <span class="ml20">参与拼团人数：{{order.goods.join_num ? order.goods.join_num : 0}}</span>
                                </div>
                                <div class="r">
                                    <el-tooltip content="小程序码"
                                                placement="top">
                                        <el-button icon="font-icon-qrcode" size="small" circle
                                                   @click.prevent="openrcodeLayer(order.order.type,order.goods.id)"></el-button>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        <el-dialog
                class="flex-center"
                title="小程序二维码"
                top="0"
                width="420px"
                :visible="isShowQrcode"
                :close-on-click-modal="false"
                @close="closeQrcodeLayer">
            <div class="tc"
                 v-loading="!qrcode"
                 element-loading-spinner="el-icon-loading"
                 style="min-height: 200px">
                <img v-if="qrcode" :src="qrcode" width="150">
            </div>
        </el-dialog>
        <CancelOrder :isShow.sync="cancelOrderShow" :orderInfo="orderInfo" @subCancelOrderLayer="_getOrderInfo"/>
        <SendExpress :isShowSend.sync="isShowSend" :orderInfo="orderInfo" @refrashList="_getOrderInfo"/>
    </div>
</template>

<script>
    import qs from 'qs'
    import {getQrcode} from '@/api/other'
    import {getOrderInfo, deleteOrder, remarksOrder, postSendOrderid} from '@/api/order'
    import Steps from './components/steps'
    import CancelOrder from './components/cancel_order'
    import SendExpress from './components/send_Express'

    export default {
        data() {
            return {
                qrcode: '',
                order: null,
                orderInfo: null,
                isShowQrcode: false,
                cancelOrderShow: false,
                isShowSend: false
            }
        },
        computed: {
            orderType() {
                switch (this.order.order.type) {
                    case '1':
                        return '一口价';
                    case '2':
                        return '竞拍';
                    case '3':
                        return '拼团'
                }
            },
            orderStatus() {
                switch (this.order.order.status) {
                    case '1':
                        return '等待买家支付运费';
                    case '2':
                        return '等待卖家支付押金';
                    case '3':
                        return '卖家已支付押金';
                    case '4':
                        return '已发货';
                    case '5':
                        return '已完成';
                    case '-1':
                        return '已删除';
                    case '-3':
                        return '已取消';
                    case '-4':
                        return '买家超时';
                    case '-5':
                        return '卖家超时'
                }
            }
        },
        created() {
            this._getOrderInfo()
        },
        methods: {
            _getOrderInfo() {
                getOrderInfo({
                    params: this.$route.params
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.order = res.result
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })

            },
            //打开快递单号弹窗
            openExpressNumber(orderInfo) {
                this.isShowSend = true
                this.orderInfo = orderInfo
            },
            cancelOrder(orderInfo) {
                this.cancelOrderShow = true
                this.orderInfo = {
                    type: orderInfo.type,
                    orderid: orderInfo.orderid,
                    statusText: this.orderStatus
                }
            },
            openRemarkLayer(remarks, orderid) {
                this.$prompt('', remarks ? '添加备注' : '添加备注', {
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
                            this._getOrderInfo()
                        } else {
                            this.$message.error(res.errorMsg)
                        }
                    })
                }).catch(() => {
                })
            },
            openrcodeLayer(type, id) {
                this.isShowQrcode = true
                let path = ''
                if (type === '3') {
                    path = `pages/group/detail/index?id=${id}`
                } else {
                    path = `pages/goods/detail/index?id=${id}`
                }
                const params = {
                    path: path
                }
                getQrcode({
                    params: params
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.qrcode = res.result
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })

            },
            closeQrcodeLayer() {
                this.isShowQrcode = false
                this.qrcode = ''
            }
        },
        components: {
            Steps,
            CancelOrder,
            SendExpress
        }
    }
</script>

<style lang="less">
    .order-detail-wrap {
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #dcdfe6;
            height: 50px;
            line-height: 50px;
            h3 {
                font-size: 18px;
                line-height: 42px;
                font-weight: bold;
            }
        }
        .remark {
            width: 100%;
            line-height: 34px;
            border: 1px solid #D9D9D9;
            background-color: #FFFAEB;
            color: #FF9C12;
            padding: 0 10px;
            margin-top: -10px;
        }
        .left-content,
        .right-content {
            flex: 1;
        }
        .list-item {
            display: flex;
            flex-wrap: wrap;
            margin: 30px 0;
            padding: 5px;
            cursor: pointer;
            background-color: #F2F2F2;
            .img {
                width: 100px;
                height: 100px;
                position: relative;
                overflow: hidden;
                img {
                    width: 100%;
                }
                .video-shadow {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 40px;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.5);
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .send {
                    width: 70px;
                    font-size: 12px;
                    color: #fff;
                    background-color: #7ED321;
                    text-align: center;
                    transform: rotate(-45deg);
                    position: absolute;
                    left: -16px;
                    top: 10px;
                }
            }
            .content {
                flex: 1;
                margin-left: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .desc {
                    font-size: 12px;
                    color: #808080;
                }
                .bottom {
                    height: 17px;
                    position: relative;
                    .control {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                    }
                }
            }
        }
        .bd {
            border: 1px solid #BFBFBF;
        }
    }
</style>