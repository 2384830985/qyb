<template>
    <div class="product-detail-wrap" v-loading="isLoading" element-loading-text="拼命加载中">
        <template v-if="p_data">
            <div class="page-title">
                <h3>{{p_data.goods.title}}</h3>
            </div>
            <div class="detail">
                <div class="Z-row clearfix flex-center">
                    <span>{{p_data.goods.add_time}}</span>
                    <span class="username flex-center ml20">
                    <img class="avatar" :src="`${p_data.goods.avatar}/230x230`" alt="">
                    <span class="ml5">{{p_data.goods.username}}</span>
                </span>
                </div>
                <div class="Z-row">
                    <span class="space-bg-tag green" v-if="p_data.goods.is_new==='1'">全新宝贝</span>
                </div>
                <div class="Z-row">
                    <span class="Z-name">宝贝类型：</span>
                    <span class="Z-content">{{p_data.goods.is_big === '1' ? '大件' : '小件'}}</span>
                </div>
                <div class="Z-row">
                    <span class="Z-name">宝贝分类：</span>
                    <span class="Z-content">
                    <el-select v-model="p_data.goods.category_id" placeholder="请选择">
                        <el-option
                                v-for="(item,index) in typeOpt"
                                :key="item.index"
                                :label="item.value"
                                :value="item.label">
                        </el-option>
                    </el-select>
                </span>
                </div>
                <div class="Z-row">
                    <span class="Z-name">交付方式：</span>
                    <span class="Z-content">{{deliver}}</span>
                </div>
                <div class="Z-row" v-if="p_data.goods.type==='1'">
                    <span class="Z-name">一口价：</span>
                    <span class="Z-content">
                    <i class="red"><b class="ft18">{{p_data.goods.price}}</b> 钻</i>
                </span>
                </div>
                <div class="Z-row" v-else>
                    <span class="Z-name">起拍价：</span>
                    <span class="Z-content">
                    <i class="red"><b class="ft18">{{p_data.goods.price}}</b> 钻</i>
                </span>
                </div>
                <div class="Z-row" v-if="p_data.goods.auction_hour!=0">
                    <span class="Z-name">竞拍时间：</span>
                    <span class="Z-content">{{p_data.goods.auction_hour}}小时</span>
                </div>
                <div class="Z-row" v-if="p_data.goods.left_time>0">
                    <span class="Z-name">倒计时：</span>
                    <span class="Z-content red">{{countDown}}</span>
                </div>
                <div class="Z-row" v-if="p_data.goods.type==='2' && p_data.goods.is_finish!=='0'">
                    <span class="Z-name">成交价：</span>
                    <span class="Z-content red">{{p_data.goods.final_price ? p_data.goods.final_price : '暂无人出价'}}</span>
                </div>
                <div class="Z-row">
                    <span class="Z-name">姓名：</span>
                    <span class="Z-content">{{p_data.goods.address.name}}</span>
                </div>
                <div class="Z-row">
                    <span class="Z-name">手机号：</span>
                    <span class="Z-content">{{p_data.goods.address.tel}}</span>
                </div>
                <div class="Z-row">
                    <span class="Z-name">取件地址：</span>
                    <span class="Z-content">{{`${p_data.goods.address.province}${p_data.goods.address.city}${p_data.goods.address.county}${p_data.goods.address.detail}`}}</span>
                </div>
                <div class="Z-block-row">
                    <span class="Z-name">宝贝描述：</span>
                    <div class="Z-content">
                        <div class="desc">{{p_data.goods.desc}}</div>
                        <div class="pic-desc clearfix">
                            <div class="video-list" v-if="p_data.goods.is_video==='1'">
                                <img :src="p_data.goods.cover">
                                <div class="video-shadow" @click="openVideo(p_data.goods.video)">
                                    <i class="el-icon-caret-right"></i>
                                </div>
                            </div>
                            <ul class="pic-list">
                                <li class="pic-item" v-for="(item,index) in p_data.goods.imgs" :key="index">
                                    <img class="preview-img" :src="`${item}/230x230`"
                                         @click="openPreview(index)">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="check-fixed-box">
                    <div class="check-fixed-wrap flex-around" v-if="p_data.goods.status==='0'">
                        <div class="check-wrap">
                            <el-radio-group class="check-left-wrap" v-model="status" @change="canSub = false">
                                <el-radio label="1">
                        <span class="check-content">
                            <i class="el-icon-check green"></i>通过
                        </span>
                                </el-radio>
                                <el-radio label="-4">
                        <span class="check-content">
                            <i class="el-icon-close red"></i>不通过
                        </span>
                                </el-radio>
                                <el-radio label="-3">
                        <span class="check-content">
                            <i class="el-icon-edit red"></i>需修改
                        </span>
                                </el-radio>
                            </el-radio-group>
                            <div class="v-line" v-if="status==='-3'||status==='-4'"></div>
                            <div class="check-right-wrap" v-if="p_data.checkText && status==='-3'">
                                <el-checkbox-group class="edit-reason" v-model="editReason">
                                    <el-checkbox v-for="(item,index) in p_data.checkText" :key="index" :label="item.content"
                                                 name="reason">
                                        <el-input v-if="item.tips===6"
                                                  class="other-reason"
                                                  size="small"
                                                  v-model="other_reason"
                                                  placeholder="还有什么理由呢..."
                                                  style=" width: 285px;">
                                        </el-input>
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div class="check-right-wrap" v-if="status==='-4'">
                                <el-checkbox v-model="is_violation">
                                    <p>扣除30%钻石</p>
                                    <p class="red ft12">仅当用户发布违法违规内容时选择</p>
                                </el-checkbox>
                            </div>
                        </div>
                        <div slot="footer">
                            <el-button type="primary" :disabled="canSub" @click="subCheckStatus">提交</el-button>
                        </div>
                    </div>
                    <div class="check-fixed-wrap flex-around" v-else>
                        <el-button type="primary" @click="subEdit">提交</el-button>
                    </div>
                </div>
                <div class="qrcode-wrap" ref="qrcode">
                    <div class="qrcode">
                        <img :src="p_data.wxcode.link" alt="">
                        <p>微信扫一扫</p>
                        <p>前往小程序浏览</p>
                    </div>
                    <div class="order-status pd5" v-if="p_data.wxcode.orderid">
                        <p>订单状态：</p>
                        <p>{{orderStatus}}</p>
                    </div>
                    <div class="to-order tc pd5" v-if="p_data.wxcode.orderid">
                        <router-link
                                :to="{name:'order_managelist',query:{type:p_data.wxcode.type,id:p_data.goods.id}}"
                                target="_blank"
                                class="red ft18">相关订单>
                        </router-link>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import {getGoodsInfo, checkGoods, editGoods} from '@/api/product'
    import qs from 'qs'
    import util from '@/base/js/util'

    export default {
        data() {
            return {
                isLoading: false,
                p_data: null,
                previewList: [],
                status: '',
                editReason: [],
                other_reason: '',
                is_violation: '',
                canSub: true,
                countDown: ''
            }
        },
        computed: {
            typeOpt() {
                return this.p_data.category.map(val => ({
                    label: val.id,
                    value: val.name
                }))
            },
            deliver() {
                let str = ''
                switch (this.p_data.goods.deliver) {
                    case '1':
                        str = '仅限同城'
                        break
                    case '2':
                        str = '仅限快递'
                        break
                    case '3':
                        str = '快递+同城自取'
                        break
                }
                return str
            },
            orderStatus() {
                switch (this.p_data.wxcode.status) {
                    case '1':
                        return '待付款';
                    case '2':
                        return '卖家支付押金';
                    case '3':
                        return '待发货';
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
            this.getDetail()
        },
        destroyed() {
            window.onscroll = ''
        },
        methods: {
            //获取宝贝详情
            getDetail() {
                this.isLoading = true
                const id = this.$route.params.id
                getGoodsInfo({
                    params: {
                        id: id
                    }
                }).then(res => {
                    this.isLoading = false
                    if (res.resultCode === '0') {
                        this.p_data = res.result
                        this.initCountDown()
                        this.initPreview()
                        //二维码悬浮
                        this.$nextTick(() => {
                            const qrcodeTop = this.$refs['qrcode'].offsetTop
                            window.onscroll = () => {
                                const scrollTop = document.querySelector('html,body').scrollTop
                                let qrcodeTopNum = qrcodeTop
                                qrcodeTopNum += scrollTop
                                this.$refs['qrcode'].style.top = `${qrcodeTopNum}px`
                            }
                        })
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            },
            //初始化倒计时
            initCountDown() {
                if (!this.p_data.goods.left_time > 0) return
                const self = this
                util.countDown(self, this.p_data.goods.left_time, function (timeData) {
                    self.countDown = `${timeData.d ? timeData.d + '天' : ''}${timeData.h ? timeData.h + ':' : ''}${timeData.m ? timeData.m + ':' : ''}${timeData.s ? timeData.s : ''}`
                })
            },
            //初始化图片预览
            initPreview() {
                const that = this
                const imgList = this.p_data.goods.imgs
                if (imgList.length) {
                    //清空预览图片数组，避免无限添加
                    that.previewList = []
                    for (let i in imgList) {
                        let img_item = {}
                        //创建promise记录每张图片的宽高
                        new Promise(function (resolve, reject) {
                            const img = new Image()
                            img.src = `${imgList[i]}/640`
                            img.onload = function () {
                                const data = {
                                    src: img.src,
                                    width: img.width,
                                    height: img.height
                                }
                                resolve(data)
                            }
                        }).then(function (data) {
                            img_item.src = data.src
                            img_item.w = data.width
                            img_item.h = data.height
                            that.previewList[i] = img_item
                        })
                    }
                }
            },
            //点击预览
            openPreview(index) {
                this.$preview.open(index, this.previewList, {
                    bgOpacity: 0.6,
                    captionEl: false,
                    fullscreenEl: false,
                    shareEl: false,
                    history: false,
                    pinchToClose: false,
                    closeOnScroll: false,
                    closeOnVerticalDrag: false
                })
            },
            //点击视频
            openVideo(src) {
                this.$alert(`<div class="tc"><video src="${src}" controls></video></div>`, '宝贝视频', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '关闭'
                });
            },
            //获取审核详情
            initSubData() {
                const data = {
                    id: this.p_data.goods.id,
                    status: this.status,
                    cid: this.p_data.goods.category_id
                }
                if (this.status === '-3') {
                    if (this.editReason.length < 1) {
                        this.$message.error('请至少选择一项需修改意见')
                        return false
                    } else {
                        if (this.editReason.includes('') && this.other_reason === '') {
                            this.$message.error('请填写其他修改理由')
                            return false
                        }
                        if (['1', '2'].every(val => this.editReason.includes(val))) {
                            this.$message.error('修改理由的大小件修改只能选一项')
                            return false
                        }
                        data.reason_rejection = []
                        for (let i in this.checkText) {
                            for (let j in this.editReason) {
                                if (this.checkText[i].content === this.editReason[j]) {
                                    let reason_rejection_item = this.checkText[i]
                                    let content = this.editReason[j]
                                    if (this.editReason[j] === '') {
                                        content = this.other_reason
                                    }
                                    reason_rejection_item.content = content
                                    data.reason_rejection.push(reason_rejection_item)
                                }
                            }
                        }
                    }
                } else if (this.status === '-4') {
                    data.is_violation = Number(this.is_violation)
                }
                return data
            },
            //提交审核
            subCheckStatus() {
                const data = this.initSubData()
                if (!data) return
                checkGoods({
                    data: qs.stringify(data)
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.$message.success(res.errorMsg)
                        this.getDetail()
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            },
            //修改宝贝
            subEdit() {
                editGoods({
                    params: {
                        id: this.p_data.goods.id,
                        cid: this.p_data.goods.category_id
                    }
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.$message.success(res.errorMsg)
                        this.getDetail()
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    .product-detail-wrap {
        position: relative;
        padding-bottom: 180px;
        min-height: 600px;
        .page-title {
            font-size: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #dcdfe6;
        }
        .username {
            .avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
            }
        }
        .pic-desc {
            margin-top: 20px;
            .pic-list {
                display: inline;
            }
            .video-list, .pic-item {
                width: 200px;
                height: 200px;
                margin: 0 20px 20px 0;
                float: left;
                position: relative;
                cursor: pointer;
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
            .video-shadow {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 100px;
                color: #fff;
                background-color: rgba(0, 0, 0, 0.5);
                position: absolute;
                top: 0;
                left: 0;
            }
        }
        .check-fixed-box{
            min-width: 1200px;
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            padding: 0 60px 0 316px;
        }
        .check-fixed-wrap {
            max-width: 1220px;
            min-width: 860px;
            min-height: 100px;
            margin: 0 auto;
            background-color: #fff;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            .check-wrap {
                width: 570px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 20px;
            }
            .check-left-wrap {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .el-radio {
                width: 150px;
                padding: 0 0 0 10px;
                margin-bottom: 20px;
            }
            .el-radio + .el-radio {
                margin-left: 0;
            }
            .check-content {
                [class^=el-icon-] {
                    font-size: 30px;
                    vertical-align: middle;
                    margin-top: -6px;
                    margin-right: 5px;
                }
            }
            .v-line {
                width: 1px;
                height: 100px;
                background-color: #D9D9D9;
                margin: 0 50px;
            }
            .check-right-wrap {
                .el-checkbox__label {
                    vertical-align: top;
                }
            }
            .edit-reason {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                width: 300px;
                .el-checkbox {
                    margin: 0 0 10px 0;
                }
            }
        }
        .qrcode-wrap {
            position: absolute;
            right: 0px;
            top: 20px;
            width: 200px;
            border: 1px solid #BFBFBF;
            background-color: #fff;
            .qrcode {
                width: 180px;
                margin: 15px auto 15px;
                text-align: center;
                img {
                    width: 100%;
                    margin-bottom: 15px;
                }
            }
            .order-status {
                border-top: 1px solid #BFBFBF;
                border-bottom: 1px solid #BFBFBF;
            }
        }
    }
</style>