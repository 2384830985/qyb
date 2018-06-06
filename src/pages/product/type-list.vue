<template>
    <div class="product-manage-list">
        <div class="list-header">
            <h3>宝贝分类管理</h3>
            <el-button type="primary" size="small" @click="addType">添加分类</el-button>
        </div>
        <div class="list-wrap" v-loading="isLoading" element-loading-text="拼命加载中">
            <ul class="list" v-if="type_list">
                <li v-for="(item,index) in type_list" :key="index">
                    <h3>{{item.name}}</h3>
                    <div class="bottom">
                        <span class="mr20 black">共{{item.all_num}}件宝贝</span>
                        <span class="mr20 ">{{item.online_num}}件上线</span>
                        <span class="mr20 ">{{item.check_num}}件待审核</span>
                        <span class="mr20 ">{{item.ykj_num}}件一口价</span>
                        <span class="mr20 ">{{item.jp_num}}件竞拍</span>
                        <div class="control">
                            <el-tooltip content="编辑" placement="top">
                                <el-button icon="font-icon-edit" size="small" circle
                                           @click="editType(item.name,item.id)"></el-button>
                            </el-tooltip>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {getCategoryList, addCategory} from '@/api/product'

    export default {
        data() {
            return {
                isLoading: true,
                type_list: null
            }
        },
        created() {
            this.getTypeList()
        },
        methods: {
            //获取列表
            getTypeList() {
                this.isLoading = true
                getCategoryList().then(res => {
                    this.isLoading = false
                    if (res.resultCode === '0') {
                        this.type_list = res.result
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            },
            //增加type
            addType() {
                this.$confirm('添加分类后不可删除！', '提示', {
                    confirmButtonText: '知道了，继续操作',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.addTypeLayer()
                }).catch(() => {
                })
            },
            //添加|编辑分类
            addTypeLayer(typeName = null, id) {
                this.$prompt('', typeName ? '编辑分类' : '添加分类', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                    inputValue: typeName,
                    inputPlaceholder: '请输入4字以内的分类名',
                    inputValidator(value) {
                        if (value === null || value === '') {
                            return '请输入分类名'
                        } else {
                            if (value.length > 4) {
                                return '分类名不能超过4个字'
                            }
                            return true
                        }
                    }
                }).then(({value}) => {
                    addCategory({
                        params: {
                            cate_name: value,
                            id: id
                        }
                    }).then(res => {
                        if (res.resultCode === '0') {
                            this.$message.success(res.errorMsg)
                            this.getTypeList()
                        } else {
                            this.$message.error(res.errorMsg)
                        }
                    })
                }).catch(() => {
                })
            },
            editType(typeName, id) {
                this.addTypeLayer(typeName, id)
            }
        }
    }
</script>

<style lang="less">
    .product-manage-list {
        padding-left: 30px;
        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #dcdfe6;
            h3 {
                font-size: 20px;
            }
        }
        .list-wrap {
            min-height: 500px;
            .list {
                min-height: 500px;
                li {
                    padding: 20px 0;
                    border-bottom: 1px dashed #dcdfe6;
                    h3 {
                        font-size: 16px;
                        font-weight: bold;
                        color: #000;
                    }
                    .bottom {
                        height: 17px;
                        margin-top: 20px;
                        position: relative;
                        color: #999;
                        .control {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                        }
                    }
                }
            }
        }
    }
</style>