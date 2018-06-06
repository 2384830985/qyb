<template>
    <el-dialog class="flex-center"
               title="发货信息"
               top="0"
               width="420px"
               :visible="isShowSend"
               @close="closeSendLayer">
        <el-form :model="expressForm"
                 :rules="rules"
                 ref="expressForm"
                 labelWidth="100px"
                 label-position="left">
            <el-form-item label="快递公司：" prop="send_company">
                <el-input v-model="expressForm.send_company"
                          auto-complete="off"
                          placeholder="请填写快递公司">
                </el-input>
            </el-form-item>
            <el-form-item label="快递单号：" prop="send_orderid">
                <el-input v-model="expressForm.send_orderid"
                          auto-complete="off"
                          placeholder="请填写快递单号">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeSendLayer('expressForm')">取 消</el-button>
            <el-button type="primary" :loading="isSendExpressData" @click="subExpressNumber('expressForm')">确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {postSendOrderid} from '@/api/order'

    export default {
        props: {
            isShowSend: {
                type: Boolean,
                default: false
            },
            orderInfo: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                isSendExpressData: false,
                expressForm: {
                    orderid: '',
                    send_company: '',
                    send_orderid: ''
                },
                rules: {
                    send_company: [
                        {required: true, message: '快递公司不能为空', trigger: 'blur'}
                    ],
                    send_orderid: [
                        {required: true, message: '快递单号不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //提交快递单号
            subExpressNumber(formName) {
                this.isSendExpressData = true
                this.expressForm.orderid = this.orderInfo.orderid
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        postSendOrderid({
                            params: this.expressForm
                        }).then(res => {
                            this.isSendExpressData = false
                            if (res.resultCode === '0') {
                                this.$message.success(res.errorMsg)
                                this.closeSendLayer(formName)
                                this.$emit('refrashList')
                            } else {
                                this.$message.error(res.errorMsg)
                            }
                        })
                    } else {
                        this.$message.error('提交失败')
                        return false
                    }
                })
            },
            //关闭快递单号弹窗
            closeSendLayer(formName = 'expressForm') {
                this.$emit('update:isShowSend', false)
                this.$refs[formName].resetFields()
            }
        }
    }
</script>

<style lang="less">

</style>