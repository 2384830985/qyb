<template>
    <li class="item">
        <router-link :to="`/event/editevent/${id}`" target="_blank">
            <div class="item-img">
                <img v-lazy="`${img}/230x230`" alt="">
            </div>
        </router-link>
        <div class="item-content">
            <div class="item-title">
                <router-link :to="`/event/editevent/${id}`" target="_blank">
                    <strong>{{title}}</strong>
                </router-link>
                <span class="gray">{{addTime}}</span>
            </div>
            <div class="item-desc gray">
                <slot name="content"></slot>
            </div>
            <div class="item-bottom">
                <slot name="bottom"></slot>
            </div>
        </div>
    </li>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                default: ''
            },
            img: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            addTime: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
    li {
        padding: 15px 0;
        display: flex;
        border-bottom: 1px solid #dcdfe6;
        .item-img {
            width: 100px;
            height: 100px;
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
        .item-content {
            flex: 1;
            padding: 0 10px 0 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .item-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            strong {
                font-size: 16px;
            }
        }
        .item-bottom {
            & > div {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
</style>