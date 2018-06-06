<template>
    <div class="product-list-wrap" v-loading="isLoading" element-loading-text="拼命加载中">
        <ul class="product-list" v-if="list_data">
            <li v-for="(item,index) in list_data.data" :key="index">
                <router-link :to="`/product/detail/${item.id}`" target="_blank">
                    <div class="list-item"
                         :class="['-2','-5'].includes(item.status)&&'list-gray-item'">
                        <div class="img">
                            <img v-lazy="`${item.cover}/230x230`">
                            <div class="video-shadow" v-if="item.is_video==='1'">
                                <i class="el-icon-caret-right"></i>
                            </div>
                            <div class="send" v-if="item.is_finish==='1'">已送出</div>
                        </div>
                        <div class="content">
                            <div class="title lh20">
                                <span class="bg-tag red mr10" v-if="item.type==='1'">一口价</span>
                                <span class="bg-tag blue mr10" v-else>竞拍</span>
                                <strong>{{item.title}}</strong>
                                <span class="space-bg-tag green ml10" v-if="item.is_new==='1'">全新宝贝</span>
                                <span class="gray ft12 r">{{item.operate_time}}</span>
                            </div>
                            <div class="desc">
                                <span class="space-tag mr20">{{item.is_big === '1' ? '大件' : '小件'}}</span>
                                <span class="mr20">{{item.category}}</span>
                                <span class="mr20" v-if="item.type==='1'">一口价：<i class="red">{{item.price}} 钻</i></span>
                                <span class="mr20" v-else>起拍价：<i class="red">{{item.price}} 钻</i></span>
                                <span class="mr20" v-if="item.auction_hour!=='0'">竞拍时间：{{item.auction_hour}}小时</span>
                                <span class="mr20" v-if="item.left_time">倒计时：{{item.left_time}}</span>
                                <span class="mr20" v-if="item.final_price">成交价：{{item.final_price}}</span>
                            </div>
                            <div class="desc">
                                <span class="mr20">联系方式：{{item.address.name}}</span>
                                <span class="mr20">{{item.address.tel}}</span>
                            </div>
                            <div class="desc" style="line-height: 32px">
                                <span>取件地址：{{`${item.address.province}${item.address.city}${item.address.county}${item.address.detail}`}}</span>
                                <div class="r">
                                    <router-link :to="{name:'order_managelist',query:{type:item.type,id:item.id}}"
                                                 target="_blank">
                                        <el-tooltip content="订单"
                                                    placement="top"
                                                    v-if="list_type_opt.order.includes(item.status)&&item.is_finish==='1'">
                                            <el-button icon="font-icon-order" size="small" circle></el-button>
                                        </el-tooltip>
                                    </router-link>
                                    <el-tooltip content="小程序码"
                                                placement="top"
                                                v-if="list_type_opt.qrcode.includes(item.status)">
                                        <el-button icon="font-icon-qrcode" size="small" circle
                                                   @click.prevent="openQrcodeLayer(item)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="下架"
                                                placement="top"
                                                v-if="list_type_opt.down.includes(item.status)">
                                        <el-button icon="font-icon-down" size="small" circle
                                                   @click.prevent="openDownLayer(item)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="备注"
                                                placement="top"
                                                v-if="list_type_opt.remark.includes(item.status)">
                                        <el-button icon="font-icon-remark" size="small" circle
                                                   @click.prevent="openRemarkLayer(item)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="审核"
                                                placement="top"
                                                v-if="item.status==='0'">
                                        <el-button icon="font-icon-check" size="small" circle
                                                   @click.prevent="openCheckLayer(item)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="编辑"
                                                placement="top"
                                                v-else-if="list_type_opt.edit.includes(item.status)">
                                        <el-button icon="font-icon-edit" size="small" circle></el-button>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="remark" v-if="item.remark">备注：{{item.remark}}</div>
                        <div class="day-all-num" v-if="item.new_goods_time_num">
                            <span>{{item.new_goods_time_num.date_title}}</span>
                            <br>
                            <span class="ft12 gray">{{item.new_goods_time_num.num}}条</span>
                        </div>
                    </div>
                </router-link>
            </li>
        </ul>
        <el-row class="red mt20" v-if="!isLoading && !list_data.data.length">暂时没有宝贝...</el-row>
        <el-row class="mt30 tc" v-if="list_data">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :background="true"
                    :current-page="list_data.page"
                    :page-size="list_data.size"
                    layout="total, prev, pager, next, jumper"
                    :total="Number(list_data.count)"
                    v-if="list_data.count>list_data.size">
            </el-pagination>
        </el-row>
        <CheckLayer :checkShow.sync="isShowCheckLayer" :id="item.id" :checkText="checkText" @updateList="getList"/>
        <el-dialog
                class="flex-center"
                title="提示"
                top="0"
                :visible.sync="isShowForceDownLayer"
                width="420px"
                @close="closeDownLayer">
            <span v-if="item && item.type==='1'">注意：宝贝正在交易中，此时下架会影响正在参与的用户！</span>
            <span v-else>注意：竞拍正在进行中，此时下架会影响正在参与的用户！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDownLayer">取 消</el-button>
                <el-button type="primary"
                           :disabled="countDown>0"
                           @click="down"
                >知道了，强制下架{{countDown}}</el-button>
            </span>
        </el-dialog>
        <el-dialog
                class="flex-center"
                title="提示"
                top="0"
                :visible.sync="isShowDownLayer"
                width="420px"
                @close="closeDownLayer">
            <span>注意：你确定要下架该宝贝么！？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDownLayer">取 消</el-button>
                <el-button type="primary"
                           @click="down"
                >确认下架</el-button>
            </span>
        </el-dialog>
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
    </div>
</template>

<script>
    import {getProductList, downLine, setRemark} from '@/api/product'
    import {getQrcode} from '@/api/other'
    import CheckLayer from './check-layer'
    import util from '@/base/js/util'
    import {mapMutations} from 'vuex'
    import qs from 'qs'

    //宝贝状态 0审核中 1上线 -1删除 -2后台下线 -3需修改 -4审核不通过 -5用户下架宝贝 2已完成
    export default {
        props: {
            list: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                list_data: null,//列表
                list_type_opt: {//列表操作项配置
                    order: ['1', '-2', '-5'],
                    qrcode: ['1'],
                    down: ['1'],
                    remark: ['0', '1', '-2', '-3', '-4', '-5'],
                    edit: ['0', '1', '-2', '-3', '-4', '-5']
                },
                isAuction: false, //当前点击宝贝是否是竞拍
                isShowCheckLayer: false,//是否显示审核弹窗
                isShowDownLayer: false,//是否显示下架弹窗
                isShowForceDownLayer: false,//是否显示强制下架弹窗
                isShowQrcode: false,//是否显示小程序码弹窗
                item: {},//被操作项宝贝数据
                qrcode: '',//小程序码链接
                currentPage: 1,//当前页码
                checkText: null,//审核需修改项
                countDown: 3,//下架倒计时
                countDownTimer: null//下架倒计时定时器
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.product.list.isLoading
            }
        },
        methods: {
            //获取列表
            getList() {
                this.updateLoading(true)
                const data = {
                    type: this.list_data.type,
                    sort: this.list_data.sort,
                    list_type: this.list_data.list_type,
                    start_time: this.list_data.start_time,
                    end_time: this.list_data.end_time,
                    title: this.list_data.title,
                    recen_time: this.list_data.recen_time,
                    page: this.currentPage,
                    size: this.list_data.size
                }
                this.list_data = null
                getProductList({
                    params: data
                }).then(res => {
                    this.updateLoading(false)
                    if (res.resultCode === '0') {
                        this.list_data = res.result
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            },
            //翻页
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            //查看小程序码
            openQrcodeLayer(item) {
                this.isShowQrcode = true
                const params = {
                    path: `pages/goods/detail/index?id=${item.id}`
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
            //打开下架弹窗
            openDownLayer(item) {
                this.item = item
                if (item.is_finish === '0') {
                    this.isShowDownLayer = true
                } else {
                    const self = this
                    this.isShowForceDownLayer = true
                    this.countDownTimer = util.countDown(this, 3, function (timeData) {
                        self.countDown = timeData.s / 1 || ''
                    })
                }
            },
            //关闭下架弹窗
            closeDownLayer() {
                clearInterval(this.countDownTimer)
                if (this.item.is_finish === '0') {
                    this.isShowDownLayer = false
                } else {
                    this.isShowForceDownLayer = false
                }
            },
            //关闭小程序码弹窗
            closeQrcodeLayer() {
                this.isShowQrcode = false
                this.qrcode = ''
            },
            //下架
            down() {
                downLine({
                    params: {
                        id: this.item.id
                    }
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.$message.success(res.errorMsg)
                        this.isShowDownLayer = false
                        this.getList()
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            },
            //备注
            openRemarkLayer(item) {
                this.$prompt('', item.remark ? '修改备注' : '添加备注', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                    inputValue: item.remark || '',
                }).then(({value}) => {
                    const data = {
                        id: item.id,
                        remark: value
                    }
                    setRemark({
                        data: qs.stringify(data)
                    }).then(res => {
                        if (res.resultCode === '0') {
                            this.$message.success(res.errorMsg)
                            this.getList()
                        } else {
                            this.$message.error(res.errorMsg)
                        }
                    })
                }).catch(() => {
                })
            },
            //审核
            openCheckLayer(item) {
                this.isShowCheckLayer = true
                this.item = item
                this.checkText = this.list_data.checkText
            },
            ...mapMutations([
                'updateLoading'
            ])
        },
        components: {
            CheckLayer
        },
        watch: {
            list(val) {
                this.list_data = val
            }
        }
    }
</script>

<style lang="less">
    .product-list-wrap {
        min-height: 500px;
        .product-list {
            .list-item {
                display: flex;
                flex-wrap: wrap;
                margin: 30px 0;
                padding: 5px;
                cursor: pointer;
                position: relative;
                transition: all linear .2s;
                &:hover {
                    background-color: #F7F7F7;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    transform: translate3d(0, -2px, 0);
                    z-index: 2;
                    &:hover {
                        .img{
                            img {
                                transform: scale(1.1);
                            }
                        }
                    }
                }
                &.list-gray-item {
                    .content {
                        div, span, strong, i.red {
                            color: #bfbfbf;
                        }
                        .space-bg-tag, .bg-tag {
                            background-color: #BFBFBF;
                            border-color: #BFBFBF;
                            color: #fff;
                        }
                        .space-tag {
                            border-color: #BFBFBF;
                        }
                    }
                }
                .img {
                    width: 100px;
                    height: 100px;
                    position: relative;
                    overflow: hidden;
                    img {
                        width: 100%;
                        transition: all .5s ease-out .1s;
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
                    a + .el-button {
                        margin-left: 10px;
                    }
                    .el-button + a {
                        margin-left: 10px;
                    }
                }
                .remark {
                    width: 100%;
                    line-height: 34px;
                    border: 1px solid #D9D9D9;
                    background-color: #FFFAEB;
                    color: #FF9C12;
                    padding: 0 10px;
                    margin-top: 10px;
                }
                .day-all-num {
                    position: absolute;
                    left: -60px;
                }
            }
        }
    }
</style>