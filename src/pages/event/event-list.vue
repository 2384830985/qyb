<template>
    <div class="list-wrap">
        <div class="list-title">
            <h3>{{pageTitle}}</h3>
            <el-input v-model="title" size="small" placeholder="请输入活动关键词" style="width: 400px;"
                      @keyup.native.enter="initList">
                <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
            </el-input>
        </div>
        <div class="list-box"
             v-loading="loading"
             element-loading-text="拼命加载中">
            <ul class="list">
                <ListItem v-for="(item,index) in list"
                          :key="index"
                          :img="item.cover"
                          :title="item.title"
                          :id="item.id"
                          :addTime="item.add_time">
                    <div slot="content">
                        <span>兑换需：{{item.need_price}}钻</span>
                        <span class="ml20"
                              v-if="/(online|down)/.test(type)">库存：{{`${item.left_count}/${item.store_nums}`}}</span>
                        <span class="ml20" v-else>库存：{{item.store_nums}}</span>
                        <span class="ml20">{{item.need_num}}人团</span>
                        <span class="ml20">活动结束时间：{{item.end_time}}</span>
                        <span class="ml20" v-if="/(timing)/.test(type)">定时上线：{{item.start_time}}</span>
                    </div>
                    <div slot="bottom">
                        <div class="gray">
                            <span v-if="/(online|down)/.test(type)">拼团成功数：{{item.teamwork_num}}</span>
                            <span class="ml20"
                                  v-if="/(online|down)/.test(type)">参与拼团人数：{{item.join_num ? item.join_num : 0}}</span>
                        </div>
                        <div class="item-control">
                            <el-tooltip content="订单列表"
                                        placement="top"
                                        v-if="/(online|down)/.test(type)&&item.has_order">
                                <router-link :to="{name:'order_managelist',query:{type:'3',id:item.id}}"
                                             target="_blank">
                                    <el-button icon="font-icon-order" size="small" circle></el-button>
                                </router-link>
                            </el-tooltip>
                            <el-tooltip content="小程序码"
                                        placement="top"
                                        v-if="/online/.test(type)">
                                <el-button icon="font-icon-qrcode" size="small" circle
                                           @click.prevent="openrcodeLayer(item.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="上线"
                                        placement="top"
                                        v-if="/(check|timing|down)/.test(type)">
                                <el-button icon="font-icon-up" size="small" circle
                                           @click.prevent="online(item.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="下线"
                                        placement="top"
                                        v-if="/online/.test(type)">
                                <el-button icon="font-icon-down" size="small" circle
                                           @click.prevent="downline(item.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除"
                                        placement="top"
                                        v-if="/(check|timing)/.test(type)">
                                <el-button icon="el-icon-close" size="small" circle
                                           @click.prevent="delItem(item.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="编辑"
                                        placement="top">
                                <router-link :to="`/event/editevent/${item.id}`" target="_blank">
                                    <el-button icon="font-icon-edit" size="small" circle></el-button>
                                </router-link>
                            </el-tooltip>
                            <el-tooltip content="复制活动"
                                        placement="top">
                                <router-link :to="`/event/copyevent/${item.id}`"
                                             target="_blank">
                                    <el-button icon="font-icon-copy" size="small" circle></el-button>
                                </router-link>
                            </el-tooltip>
                        </div>
                    </div>
                </ListItem>
                <el-row class="red mt20" v-if="!loading && !list.length">暂时没有活动...</el-row>
            </ul>
            <el-row class="mt30 tc" v-if="count>size">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :background="true"
                        :current-page="page"
                        :page-size="size"
                        layout="total, prev, pager, next, jumper"
                        :total="count">
                </el-pagination>
            </el-row>
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
    </div>
</template>

<script>
    import {getEventList, delEvent, upLine} from '@/api/event'
    import {getQrcode} from '@/api/other'
    import qs from 'qs'
    import ListItem from './event-list-item'

    export default {
        props: {
            type: {
                type: String,
                default: ''
            },
            pageTitle: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                loading: false,
                count: 0,
                page: 1,
                size: 20,
                title: '',
                list: null,
                qrcode: '',
                isShowQrcode: false
            }
        },
        computed: {
            open_start_end_time() {
                if (this.list) {
                    let list_arr = []
                    for (let i of this.list) {
                        let s_e_time = []
                        if (i.open_start_time) {
                            for (let j of i.open_start_time) {
                                const str = `${j.open_start_time}-${j.open_end_time}`
                                s_e_time.push(str)
                            }
                        } else {
                            s_e_time.push('')
                        }
                        list_arr.push(s_e_time)
                    }
                    return list_arr
                }
            }
        },
        created() {
            this.initList()
        },
        methods: {
            initList() {
                //初始化列表数据
                this.loading = true
                const data = {type: this.type, page: this.page, size: this.size, title: this.title}
                this.list = null
                getEventList({
                    params: data
                }).then(res => {
                    this.loading = false
                    if (res.resultCode === '0') {
                        this.list = res.result.data
                        this.count = parseInt(res.result.count)
                        this.page = parseInt(res.result.page)
                        this.size = parseInt(res.result.size)
                    }
                })
            },
            edit(id) {
                this.$router.push(`/event/editevent/${id}`)
            },
            delItem(id) {
                this.$confirm('你确定要删除该活动吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delEvent({
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.resultCode === '0') {
                            this.$message.success('删除成功')
                            this.initList()
                        } else {
                            this.$message.error(res.errorMsg)
                        }
                    })
                })
            },
            online(id) {
                this.$confirm('你确定要上线该活动吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    upLine({
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.resultCode === '0') {
                            this.$message.success('上线成功')
                            this.initList()
                        } else {
                            this.$message.error(res.errorMsg)
                        }
                    })
                }).catch(() => {
                })
            },
            downline(id) {
                this.$confirm('直接下线活动会影响以拼团的用户哟~，建议直接编辑活动下线时间？', '提示', {
                    confirmButtonText: '强制下线',
                    cancelButtonText: '取消',
                    confirmButtonClass: 'default-button',
                    cancelButtonClass: 'el-button--primary',
                    type: 'warning'
                }).then(() => {
                    upLine({
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.resultCode === '0') {
                            this.$message.success('下线成功')
                            this.initList()
                        } else {
                            this.$message.error(res.errorMsg)
                        }
                    })
                }).catch(() => {
                })
            },
            openrcodeLayer(id) {
                this.isShowQrcode = true
                const params = {
                    path: `pages/group/detail/index?id=${id}`
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
            },
            handleCurrentChange(val) {
                this.page = val
                this.initList()
            }
        },
        components: {
            ListItem
        }
    }
</script>

<style lang="less">
    .list-wrap {
        .list-box, .list {
            min-height: 500px;
        }
        .list-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #dcdfe6;
            padding-bottom: 20px;
            h3 {
                font-size: 20px;
            }
        }
        .item-control {
            a + .el-button {
                margin-left: 10px;
            }
            .el-button + a {
                margin-left: 10px;
            }
            a + a {
                margin-left: 10px;
            }
        }
    }

    .el-button.default-button {
        color: #606266;
        background-color: transparent;
        border-color: #dcdfe6;
    }
</style>