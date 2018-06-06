<template>
    <el-form class="form-wrap"
             :model="form"
             :rules="rules"
             ref="form"
             v-if="form"
             label-position="left">
        <el-form-item prop="title">
            <el-input class="event-title" v-model="form.title" placeholder="请输入活动产品名">
                <span :class="form.title.length>24?'red':''" slot="suffix">{{form.title.length}}/24</span>
            </el-input>
        </el-form-item>
        <el-form-item prop="intro">
            <el-row class="ft16">活动产品简介：</el-row>
            <el-input type="textarea" :rows="10" v-model="form.intro" placeholder="请输入活动产品介绍">
            </el-input>
        </el-form-item>
        <el-form-item prop="banner">
            <el-row class="ft16">活动入口banner：<span class="red ft12">160x220</span></el-row>
            <ImgList :ratio="160/220" :pic="form.banner" :pic_list="banner_list" @cropItem="cropImg"
                     @deleteItem="deleteImg"/>
            <el-upload
                    class="uploader"
                    action="/admin/common/UploadImg"
                    :show-file-list="false"
                    :limit="1"
                    :on-success="uploadBannerSuccess">
                <i class="el-icon-plus uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item prop="img">
            <el-row class="ft16">轮播图：<span class="red ft12">800x800</span></el-row>
            <ImgList :ratio="800/800" :pic="form.img" :pic_list="img_list" @cropItem="cropImg" @deleteItem="deleteImg"/>
            <el-upload
                    class="uploader"
                    action="/admin/common/UploadImg"
                    :show-file-list="false"
                    :multiple="true"
                    :on-progress="uploadProgress"
                    :on-success="uploadSuccess">
                <i class="el-icon-plus uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-row class="ft16 mb20">拼团设置：</el-row>
        <el-form-item label="拼团所需人数：" prop="other_need_num" v-if="!(isEdit && form.has_order!=1)">
            <el-radio v-model="need_num" label="5">5人</el-radio>
            <el-radio v-model="need_num" label="10">10人</el-radio>
            <el-radio v-model="need_num" label="15">15人</el-radio>
            <el-radio v-model="need_num" label="20">20人</el-radio>
            <el-radio v-model="need_num" label="25">
                <el-input class="group-num" v-model.number="other_need_num"></el-input>
                人
            </el-radio>
        </el-form-item>
        <el-form-item label="拼团所需人数：" v-else>{{form.need_price}}</el-form-item>

        <el-form-item class="iblock"
                      label="总库存："
                      label-width="110px"
                      prop="store_nums"
                      v-if="!(isEdit && form.has_order!=1)">
            <el-input v-model.number="form.store_nums" placeholder="输入大于0的整数"></el-input>
        </el-form-item>
        <el-form-item label="总库存：" v-else>{{form.store_nums}}</el-form-item>

        <el-form-item class="iblock ml20"
                      label="单位："
                      label-width="110px"
                      prop="unit"
                      v-if="!(isEdit && form.has_order!=1)">
            <el-input v-model="form.unit"></el-input>
        </el-form-item>
        <el-form-item label="单位：" v-else>{{form.unit}}</el-form-item>

        <el-form-item label="运费设置：" prop="freight_way" v-if="!(isEdit && form.has_order!=1)">
            <el-radio v-model="form.freight_way" label="1">平台包邮</el-radio>
            <el-radio v-model="form.freight_way" label="2">用户支付</el-radio>
        </el-form-item>
        <el-form-item label="运费设置：" v-else>{{form.freight_way === '1' ? '平台包邮' : '用户支付'}}</el-form-item>

        <el-form-item label="兑换所需钻：" prop="other_need_price" v-if="!(isEdit && form.has_order!=1)">
            <el-radio v-model="need_price" label="1">1钻</el-radio>
            <el-radio v-model="need_price" label="5">5钻</el-radio>
            <el-radio v-model="need_price" label="10">10钻</el-radio>
            <el-radio v-model="need_price" label="20">20钻</el-radio>
            <el-radio v-model="need_price" label="25">
                <el-input class="group-num" v-model.number="other_need_price"></el-input>
                钻
            </el-radio>
        </el-form-item>
        <el-form-item label="兑换所需钻：" v-else>{{form.need_price}}钻</el-form-item>

        <el-form-item prop="rule_desc" label="拼团规则简介：">
            <el-input type="textarea" :rows="8" v-model="form.rule_desc" placeholder="请输入拼团规则简介">
            </el-input>
        </el-form-item>
        <el-row class="ft16 mb20">活动时间设置：</el-row>
        <el-form-item class="iblock" label="活动上线时间：" label-width="130px" prop="start_time">
            <el-date-picker
                    v-model="form.start_time"
                    type="datetime"
                    :editable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item class="iblock ml20" label="活动下线时间：" label-width="130px" prop="end_time">
            <el-date-picker
                    v-model="form.end_time"
                    type="datetime"
                    :editable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <div class="sub-fixed-box">
            <el-form-item class="sub-wrap tc">
                <el-button type="primary" :loading="isSending" style="width: 200px" @click="submit('form')">提交
                </el-button>
            </el-form-item>
        </div>
        <MyCropper :isShow.sync="showCropper" :cropperData="cropperData" @updateImg="updateImg"/>
    </el-form>
</template>

<script>
    import {subEvent} from '@/api/event'
    import qs from 'qs'
    import ImgList from '@/components/img-list'
    import MyCropper from '@/components/my-cropper'

    export default {
        props: {
            url: {
                type: String,
                default: ''
            },
            formData: {
                type: Object,
                default: null
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                need_num: '',
                other_need_num: '',
                need_price: '',
                other_need_price: '',
                showCropper: false,
                cropperData: {},
                form: null,
                isSending: false,
                rules: {
                    title: [
                        {required: true, message: '请输入活动产品名', trigger: 'blur'},
                        {type: 'string', max: 24, message: '最多输入24个字', trigger: 'blur'}
                    ],
                    intro: [
                        {required: true, message: '请输入活动产品介绍', trigger: 'blur'}
                    ],
                    banner: [
                        {required: true, message: '请上传活动入口banner'}
                    ],
                    img: [
                        {required: true, message: '请至少上传一张轮播图'}
                    ],
                    store_nums: [
                        {required: true, message: '请输入总库存'},
                        {type: 'number', message: '库存必须为数字值'}
                    ],
                    unit: [
                        {required: true, message: '请输入单位', trigger: 'blur'}
                    ],
                    rule_desc: [
                        {required: true, message: '请输入拼团规则简介', trigger: 'blur'}
                    ],
                    end_time: [
                        {required: true, message: '请填写活动下线时间', trigger: 'change'}
                    ]
                }
            }
        },
        computed: {
            img_list() {
                let arr = []
                for (let i in this.form.img) {
                    arr.push(`${this.form.img[i]}/640`)
                }
                return arr
            },
            banner_list() {
                let arr = []
                if (this.form.banner) {
                    arr.push(`${this.form.banner}/640`)
                }
                return arr
            }
        },
        created() {
            if (this.formData) {
                this.initFormData()
            }
        },
        methods: {
            initFormData() {
                //初始化表单数据
                this.form = this.formData
                //初始化拼团所需人数
                const arr1 = ['5', '10', '15', '20']
                if (arr1.includes(this.form.need_num)) {
                    this.need_num = this.form.need_num
                } else {
                    this.other_need_num = this.form.need_num
                    this.need_num = '25'
                }
                //初始化拼团所需钻
                const arr2 = ['1', '5', '10', '20']
                if (arr2.includes(this.form.need_price)) {
                    this.need_price = this.form.need_price
                } else {
                    this.other_need_price = this.form.need_price
                    this.need_price = '25'
                }
            },
            uploadProgress(event, file, fileList) {
                console.log(event)
            },
            uploadSuccess(response, file, fileList) {
                //图片上传成功后的数据处理
                if (!response.result) {
                    this.$message.error(response.errorMsg)
                    return
                }
                this.form.img.push(response.result.url)
            },
            uploadBannerSuccess(response, file, fileList) {
                //图片上传成功后的数据处理
                if (!response.result) {
                    this.$message.error(response.errorMsg)
                    return
                }
                this.form.banner = response.result.url
            },
            cropImg(listData) {
                //裁剪图片
                let pic = listData.pic
                let index = listData.index
                let ratio = listData.ratio
                //判断pic是否是数组(数组是轮播图，字符串是banner图)
                this.cropperData.pic = pic
                this.cropperData.ratio = ratio
                if (pic instanceof Array) {
                    this.cropperData.url = pic[index]
                    this.cropperData.idx = index
                } else {
                    this.cropperData.url = pic
                }
                this.showCropper = true
            },
            updateImg(listData) {
                //更新裁剪后的图片
                let pic = listData.pic
                let url = listData.url
                let idx = listData.idx
                //判断pic是否是数组(数组是轮播图，字符串是banner图)
                if (pic instanceof Array) {
                    pic.splice(idx, 1, url)
                } else {
                    this.form.banner = url
                }
            },
            deleteImg(listData) {
                //删除图片
                let pic = listData.pic
                let index = listData.index
                //判断pic是否是数组(数组是轮播图，字符串是banner图)
                if (pic instanceof Array) {
                    pic.splice(index, 1)
                } else {
                    this.form.banner = ''
                }
            },
            submit(formName) {
                //提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //提交拼团人数
                        this.form.need_num = this.need_num
                        this.form.need_price = this.need_price
                        //选择拼团所需人数为自定义时手动赋值
                        if (this.need_num === '25') {
                            if (this.other_need_num === '' || isNaN(this.other_need_num)) {
                                this.$message.error('拼团所需人数必须为数字')
                                return
                            }
                            this.form.need_num = this.other_need_num
                        }
                        //兑换所需钻为自定义时手动赋值
                        if (this.need_price === '25') {
                            if (this.other_need_price === '' || isNaN(this.other_need_price)) {
                                this.$message.error('兑换所需钻必须为数字')
                                return
                            }
                            this.form.need_price = this.other_need_price
                        }
                        this.isSending = true
                        subEvent({
                            url: this.url,
                            data: qs.stringify(this.form)
                        }).then(res => {
                            this.isSending = false
                            if (res.resultCode === '0') {
                                this.$message.success('提交成功')
                                const _this = this
                                setTimeout(function () {
                                    if (_this.isEdit) {
                                        _this.$router.push('/event/onlinelist')
                                    } else if (_this.form.start_time) {
                                        _this.$router.push('/event/timinglist')
                                    } else {
                                        _this.$router.push('/event/checklist')
                                    }
                                }, 300)
                            } else {
                                this.$message.error(res.errorMsg)
                            }
                        })
                    } else {
                        this.$message.error('提交失败')
                    }
                })
            }
        },
        components: {
            ImgList,
            MyCropper
        },
        watch: {
            formData() {
                this.initFormData()
            }
        }
    }
</script>

<style lang="less">
    .form-wrap {
        padding-bottom: 80px;
        .event-title {
            input {
                font-size: 18px;
                outline: none;
                border-color: transparent !important;
                border-bottom-color: #dcdfe6 !important;
            }
        }
        .uploader {
            display: inline;
            .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
        }
        .uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 148px;
            height: 148px;
            line-height: 148px;
            text-align: center;
        }
        .group-num {
            width: 80px;
            margin-right: 5px;
        }
        .sub-fixed-box {
            min-width: 1200px;
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            padding: 0 60px 0 316px;
        }
        .sub-wrap {
            background-color: #fff;
            box-shadow: 0px -20px 10px rgba(255, 255, 255, 0.8);
            max-width: 1220px;
            min-width: 860px;
            min-height: 100px;
            margin: 0 auto;
        }
        .el-icon-remove,
        .el-icon-circle-plus {
            font-size: 20px;
            cursor: pointer;
        }
        .el-icon-remove {
            color: #fc6b6b;
        }
        .el-icon-circle-plus {
            color: #369ad1;
        }
    }
</style>