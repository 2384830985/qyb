<template>
    <div class="steps-wrap" :class="singleLine?'single-line':''">
        <div class="line-wrap"
             v-if="order_time.length"
             v-for="(lineItem,lineKey) in line_list"
             :key="lineKey">
            <div class="steps-item"
                 v-for="(item,index) in order_time"
                 :key="index"
                 v-if="(index===0&&lineKey===0)||(index+1>lineKey*3&&index<(lineKey+1)*3)"
                 :class="getClass(item,index)">
                <div class="steps-content">
                    <div class="steps-text">
                        <div class="steps-title">{{item.desc}}</div>
                        <div class="steps-des">{{item.add_time ? item.add_time : '&nbsp;'}}</div>
                    </div>
                    <div class="steps-btn">
                        <i :class="item.status>0?'el-icon-check':'el-icon-close'"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String
            },
            status: {
                type: String
            },
            send_type: {
                type: String
            },
            order_time: {
                type: [Object, Array],
                default: []
            }
        },
        data() {
            return {}
        },
        computed: {
            singleLine() {
                if (this.order_time.length < 4) {
                    return true
                }
            },
            line_list() {
                return Math.ceil(this.order_time.length / 3)
            }
        },
        methods: {
            //初始化个订单状态className
            getClass(item, index) {
                let className = ''
                if (item.is_finish == 0) {
                    className += 'toDo'
                } else if (item.is_finish == 1) {
                    className += 'success'
                } else if (item.is_finish == 2) {
                    className += 'error'
                }
                if (!this.singleLine && (index + 1) % 3 === 0 && (index + 1) !== this.order_time.length) {
                    className += ' vertical'
                }
                return className
            }
        }
    }
</script>

<style lang="less">
    .steps-wrap {
        &.single-line {
            .line-wrap {
                flex-wrap: nowrap;
            }
            .steps-item {
                &:last-of-type {
                    width: 20%;
                    .steps-content {
                        width: 100%;
                    }
                }
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 6px;
                    background-color: #A6A6A6;
                    position: absolute;
                    bottom: 17px;
                    left: 22%;
                }
            }
        }
        .line-wrap {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 113px;
            &:nth-of-type(even) {
                flex-direction: row-reverse;
                .steps-item {
                    display: inline-flex;
                    justify-content: flex-end;
                    &:not(:last-of-type) {
                        &:after {
                            width: 100%;
                            bottom: auto;
                            top: 17px;
                            left: -22%;
                        }
                    }
                    .steps-content {
                        flex-direction: column-reverse;
                    }
                }
            }
            &:last-of-type {
                margin-bottom: 0;
                .steps-item{
                    &:last-of-type{
                        width: 20%;
                        .steps-content{
                            width: 100%;
                        }
                    }
                }
            }
        }
        .steps-item {
            width: 40%;
            position: relative;
            .steps-content {
                width: 50%;
                min-width: 120px;
                display: inline-flex;
                align-items: center;
                flex-direction: column;
                .steps-text {
                    text-align: center;
                }
                .steps-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #A6A6A6;
                    white-space: nowrap;
                }
                .steps-des {
                    font-size: 12px;
                    color: #999;
                }
                .steps-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #A6A6A6;
                    color: #fff;
                    font-size: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 2;
                }
            }
            &.success {
                .steps-content {
                    .steps-title {
                        color: #00AFEC;
                    }
                    .steps-btn {
                        background-color: #00AFEC;
                    }
                }
                &:after {
                    background-color: #00AFEC;
                }
            }
            &.error {
                .steps-content {
                    .steps-title {
                        color: #D0021B;
                    }
                    .steps-btn {
                        background-color: #D0021B;
                    }
                }
                &:after {
                    background-color: #D0021B;
                }
            }
            &.toDo {
                .steps-content {
                    .steps-title {
                        color: #A6A6A6;
                    }
                    .steps-btn {
                        background-color: #A6A6A6;
                    }
                }
                &:after {
                    background-color: #A6A6A6;
                }
            }
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 6px;
                background-color: #A6A6A6;
                position: absolute;
                bottom: 17px;
                left: 22%;
            }
            &:last-of-type {
                &:after {
                    display: none;
                }
            }
            &.vertical {
                width: 20%;
                .steps-content {
                    width: 100%;
                }
                &:after {
                    display: block;
                    width: 6px;
                    height: 150px;
                    bottom: -133px;
                    left: 49%;
                }
            }
        }
    }
</style>