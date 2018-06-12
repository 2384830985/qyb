<template>
    <el-dialog class="check-layer-wrap" :visible="checkShow" title="审核结果" width="650px" @close="closeLayer">
        <div class="check-wrap">
            <el-radio-group class="check-left-wrap" v-model="status" @change="canSub=false">
                <el-radio label="1" border>
                        <span class="check-content">
                            <i class="el-icon-check green"></i>通过
                        </span>
                </el-radio>
                <el-radio label="-4" border>
                        <span class="check-content">
                            <i class="el-icon-close red"></i>不通过
                        </span>
                </el-radio>
                <el-radio label="-3" border>
                        <span class="check-content">
                            <i class="el-icon-edit red"></i>需修改
                        </span>
                </el-radio>
            </el-radio-group>
            <div class="v-line" v-if="status==='-3'||status==='-4'"></div>
            <div class="check-right-wrap" v-if="checkText&&status==='-3'">
                <el-checkbox-group class="edit-reason" v-model="editReason">
                    <el-checkbox v-for="(item,index) in checkText" :key="index" :label="item.content" name="reason">
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
            <el-button type="primary" @click="closeLayer">关闭</el-button>
            <el-button type="primary" :disabled="canSub" @click="subCheckStatus">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {checkGoods} from '@/api/product'
    import qs from 'qs'

    export default {
        props: {
            checkShow: {
                type: Boolean,
                default: false
            },
            id: {
                type: [String, Number],
                default: 1
            },
            checkText: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                status: '',
                editReason: [],
                is_violation: '',
                other_reason: '',
                canSub: true
            }
        },
        methods: {
            //获取审核信息
            initSubData() {
                const data = {
                    id: this.id,
                    status: this.status,
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
                        let bigSmallReason = []
                        for (let i in this.checkText) {
                            i < 3 && bigSmallReason.push(this.checkText[i].content)
                        }
                        if (bigSmallReason.every(val => this.editReason.includes(val))) {
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
            //提交审核状态
            subCheckStatus() {
                const data = this.initSubData()
                if (!data) return
                checkGoods({
                    data: qs.stringify(data)
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.$message.success(res.errorMsg)
                        this.$emit('updateList', null)
                        this.closeLayer()
                    } else {
                        this.$message.error(res.errorMsg)
                    }
                })
            },
            //关闭审核弹窗
            closeLayer() {
                this.$emit('update:checkShow', false)
                this.status = ''
                this.editReason = []
                this.other_reason = ''
                this.canSub = true
            }
        }
    }
</script>

<style lang="less">
    .check-layer-wrap {
        .check-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .check-left-wrap {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .el-radio.is-bordered {
            width: 150px;
            padding: 0 0 0 10px;
            margin-bottom: 20px;
            height: 57px;
            line-height: 57px;
        }
        .el-radio.is-bordered + .el-radio.is-bordered {
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
</style>