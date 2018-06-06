<template>
    <div class="list-header">
        <div class="list-title">
            <h3>
                <a href="javascript:;"
                   v-for="(item,index) in type"
                   :key="index"
                   :class="(index===current_type)?'on':''"
                   @click="chooseType(index)"
                >{{item}}</a>
            </h3>
            <el-input v-model="title" size="small" placeholder="请输入宝贝关键词" style="width: 400px;"
                      @keyup.native.enter="initList">
                <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
            </el-input>
        </div>
        <div class="list-status Z-row" v-if="page_type!=='check'">
            <span v-for="(item,index) in list_status"
                  :key="index"
                  v-if="item.isShowType.includes(page_type)"
                  :class="{on:index===current_status}"
                  @click="chooseStatus(item.type,index)"
            >{{item.name}}</span>
        </div>
        <div class="list-search">
            <div class="Z-row">
                <span class="Z-name">提交时间：</span>
                <el-date-picker
                        class="mr20"
                        v-model="addtime"
                        type="daterange"
                        size="small"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="changeTime">
                </el-date-picker>
                <el-button v-for="(item,index) in recen_list"
                           :key="index"
                           @click="chooseTime(item.status)"
                           type="text">{{item.name}}
                </el-button>
                <el-button class="r" type="primary" size="small" @click="sortList">提交时间{{sort ? '↑' : '↓'}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getProductList} from '@/api/product'
    import {mapMutations} from 'vuex'

    export default {
        props: {
            page_type: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                type: ['全部', '一口价', '竞拍'],
                recen_list: [
                    {name: '今天', status: 1},
                    {name: '近3天', status: 3},
                    {name: '近7天', status: 7}
                ],
                list_status: [
                    {name: '全部', isShowType: ['online', 'all'], type: 'all'},
                    {name: '待审核', isShowType: ['all'], type: 'check'},
                    {name: '未兑换', isShowType: ['online', 'all'], type: 'noexchange'},
                    {name: '已兑换', isShowType: ['online', 'all'], type: 'exchange'},
                    {name: '已下架', isShowType: ['all'], type: 'down'},
                    {name: '需修改', isShowType: ['all'], type: 'edit'},
                    {name: '不通过', isShowType: ['all'], type: 'nopass'}
                ],
                current_type: 0,
                title: '',
                addtime: [],
                current_status: 0,
                sort: false,
                recen_time: 0,
                list_type: ''
            }
        },
        created() {
            this.list_type = this.page_type
            this.initList()
        },
        methods: {
            //获取宝贝列表
            initList() {
                this.updateLoading(true)
                const data = {
                    type: this.current_type,
                    sort: Number(this.sort),
                    list_type: this.list_type,
                    start_time: this.addtime[0],
                    end_time: this.addtime[1],
                    title: this.title,
                    recen_time: this.recen_time
                }
                getProductList({
                    params: data
                }).then(res => {
                    this.updateLoading(false)
                    if (res.resultCode === '0') {
                        this.$emit('getList', res.result)
                        this.recen_time = 0
                    } else {
                        this.$message.success(res.errorMsg)
                    }
                })
            },
            //切换status
            chooseStatus(type, index) {
                this.current_status = index
                //全部按钮是上线列表与宝贝管理列表共用的，所以需要直接用page_type即可
                if (type === 'all') {
                    this.list_type = this.page_type
                } else {
                    this.list_type = type
                }
                this.initList()
            },
            //切换type
            chooseType(index) {
                this.current_type = index
                this.initList()
            },
            //选择时间
            changeTime(val) {
                if (!val) {
                    this.addtime = []
                }
                this.initList()
            },
            //时间快捷按钮
            chooseTime(status) {
                this.recen_time = status
                const et = new Date()
                const st = new Date(et.getTime()-status*86400*1000)
                this.addtime = [st,et]
                this.initList()
            },
            //排序
            sortList() {
                this.sort = !this.sort
                this.initList()
            },
            ...mapMutations([
                'updateLoading'
            ])
        }
    }
</script>

<style lang="less">
    .product-check-list {
        padding-left: 30px;
        .list-title {
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
    }
</style>