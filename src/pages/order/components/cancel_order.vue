<template>
    <el-dialog class="cancel-order-wrap" :visible="isShow" width="650px" @open="initData" @close="closeLayer">
        <div slot="title">
            <span class="ft20">取消订单</span>
            <span class="ml20 gray">当前订单状态：{{orderInfo && orderInfo.statusText}}</span>
        </div>
        <div class="cancel-order-content" v-if="orderInfo && orderInfo.type!=='3'">
            <div class="Z-block-row">
                <span class="Z-name">运费处理：</span>
                <div class="Z-content">未发货的订单将原路退回运费，已发货的订单不退运费；押金将自动退回</div>
            </div>
            <div class="Z-block-row">
                <span class="Z-name">已兑换钻石处理：</span>
                <div class="Z-content">买方已兑换的钻石归入
                    <el-select v-model="diamond_into" size="mini" placeholder="请选择">
                        <el-option
                                v-for="item in options.classify"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="Z-block-row">
                <span class="Z-name">惩罚设置：</span>
                <div class="Z-content">
                    <ul class="penalty-list">
                        <li :class="{on:penalty==='1'}" @click="showPenalty('1')">
                            <span class="item-sign buyer">买</span>
                            <div class="item-content">
                                <p class="black">买方责任</p>
                                <p class="gray ft12">扣除买方交易额20%钻石，补偿给卖方</p>
                            </div>
                            <div class="checked-sign">
                                <i class="el-icon-check"></i>
                            </div>
                        </li>
                        <li :class="{on:penalty==='2'}" @click="showPenalty('2')">
                            <span class="item-sign seller">卖</span>
                            <div class="item-content">
                                <p class="black">卖方责任</p>
                                <p class="gray ft12">扣除卖方交易额20%钻石，补偿给买方</p>
                            </div>
                            <div class="checked-sign">
                                <i class="el-icon-check"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="Z-block-row">
                <span class="Z-name">钻石变更通知说明：</span>
                <div class="Z-content">
                    <div class="Z-row">
                        <span class="Z-name">买方：</span>
                        <div class="Z-content" style="margin-left: 70px;">
                            <el-input v-model="buyer_cancel_reason" size="small" placeholder="16字以内" @change="isCanSub">
                                <span :class="{red:buyer_cancel_reason.length>16}"
                                      slot="suffix">{{buyer_cancel_reason.length}}/16</span>
                            </el-input>
                        </div>
                    </div>
                    <div class="Z-row">
                        <span class="Z-name">卖方：</span>
                        <div class="Z-content" style="margin-left: 70px;">
                            <el-input v-model="seller_cancel_reason" size="small" placeholder="16字以内"
                                      @change="isCanSub">
                                <span :class="{red:seller_cancel_reason.length>16}"
                                      slot="suffix">{{seller_cancel_reason.length}}/16</span>
                            </el-input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cancel-order-content" v-else>
            <div class="Z-block-row">
                <span class="Z-name">运费处理：</span>
                <div class="Z-content">未发货的订单将原路退回运费，已发货的订单不退运费</div>
            </div>
            <div class="Z-block-row">
                <span class="Z-name">已兑换钻石处理：</span>
                <div class="Z-content">
                    <el-radio-group v-model="is_return_user">
                        <el-radio :label="1">退还给用户</el-radio>
                        <el-radio :label="2">不退还给用户</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="Z-block-row">
                <span class="Z-name">钻石变更通知说明：</span>
                <div class="Z-content">
                    <el-input v-model="buyer_cancel_reason" size="small" placeholder="16字以内" @change="isCanSub">
                        <span :class="{red:buyer_cancel_reason.length>16}"
                              slot="suffix">{{buyer_cancel_reason.length}}/16</span>
                    </el-input>
                </div>
            </div>
        </div>
        <div slot="footer" class="tc">
            <el-button type="primary" @click="closeLayer">关闭</el-button>
            <el-button type="primary" :disabled="canSub" @click="subCheckStatus">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {deleteOrder} from '@/api/order'

    export default {
        props: {
            isShow: {
                type: Boolean,
                default: true
            },
            orderInfo: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                penalty: '',
                diamond_into: '',
                is_return_user: '',
                buyer_cancel_reason: '',
                seller_cancel_reason: '',
                canSub: true,
                options: {
                    classify: [
                        {
                            label: '买方',
                            value: '1'
                        },
                        {
                            label: '卖方',
                            value: '2'
                        }
                    ]
                }
            }
        },
        methods: {
            //选择惩罚方
            showPenalty(idx) {
                this.penalty = idx
            },
            //初始化取消订单信息
            initData(){
                this.penalty= ''
                this.diamond_into= ''
                this.is_return_user= ''
                this.buyer_cancel_reason= ''
                this.seller_cancel_reason= ''
                this.canSub= true
            },
            //是否可以提交
            isCanSub() {
                //orderInfo.type  1、2/一口价、竞拍 3/拼团订单
                if (this.diamond_into !== ''
                    && this.penalty !== ''
                    && this.buyer_cancel_reason !== ''
                    && this.seller_cancel_reason !== ''
                    && this.orderInfo.type !== '3') {
                    this.canSub = false
                } else if(this.is_return_user !== ''
                    && this.buyer_cancel_reason !== ''
                    && this.orderInfo.type === '3') {
                    this.canSub = false
                }

            },
            //关闭取消订单弹窗
            closeLayer() {
                this.$emit('update:isShow', false)
            },
            //提交取消订单信息
            subCheckStatus() {
                let params = {}
                if(this.orderInfo.type === '3'){
                    params = {
                        orderid: this.orderInfo.orderid,
                        is_return_user: this.is_return_user,
                        buyer_cancel_reason: this.buyer_cancel_reason
                    }
                }else{
                    params = {
                        orderid: this.orderInfo.orderid,
                        diamond_into: this.diamond_into,
                        penalty: this.penalty,
                        buyer_cancel_reason: this.buyer_cancel_reason,
                        seller_cancel_reason: this.seller_cancel_reason,
                    }
                }
                deleteOrder({
                    params: params
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.$message.success(res.errorMsg)
                        this.closeLayer()
                        this.$emit('subCancelOrderLayer')
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .cancel-order-content {
        width: 460px;
        margin: 0 auto;
    }

    .penalty-list {
        li {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #f2f2f2;
            padding: 20px 0;
            margin-bottom: 20px;
            cursor: pointer;
            position: relative;
            &.on {
                border-color: #FE6051;
                .checked-sign {
                    display: block;
                    width: 0;
                    height: 0;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    color: #fff;
                    border: 13px solid #FE6051;
                    border-top-color: transparent;
                    border-left-color: transparent;
                    i {
                        position: absolute;
                        right: -13px;
                        bottom: -13px;
                    }
                }
            }
        }
        .checked-sign {
            display: none;
        }
        .item-sign {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 28px;
            height: 28px;
            color: #fff;
            margin-right: 30px;
            &.buyer {
                background-color: #D0021B;
            }
            &.seller {
                background-color: #F5A623;
            }
        }
    }

    .Z-content {
        margin-left: 100px;
    }
</style>