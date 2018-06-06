<template>
    <ul class="img-list" v-if="pic_list">
        <li v-for="(item,index) in pic_list">
            <img :src="item" alt="">
            <div class="item-shadow">
                <i class="item-icon el-icon-edit" @click="cropItem(index)"></i>
                <i class="item-icon el-icon-delete ml15" @click="deleteItem(index)"></i>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            pic: {
                type: [Array, String],
                default: null
            },
            pic_list: {
                type: Array,
                default: null
            },
            ratio: {
                type: Number,
                default: 1.6
            }
        },
        data() {
            return {}
        },
        methods: {
            cropItem(index) {
                const listData = {
                    pic: this.pic,
                    pic_list: this.pic_list,
                    ratio: this.ratio,
                    index: index
                }
                this.$emit('cropItem', listData)
            },
            deleteItem(index) {
                const listData = {
                    pic: this.pic,
                    pic_list: this.pic_list,
                    index: index
                }
                this.$emit('deleteItem', listData)
            }
        }
    }
</script>

<style lang="less" scoped>
    .img-list {
        display: inline;
        li {
            width: 146px;
            height: 146px;
            line-height: 146px;
            border: 1px solid #c0ccda;
            border-radius: 6px;
            display: inline-block;
            margin: 0 10px 10px 0;
            vertical-align: top;
            position: relative;
            overflow: hidden;
            text-align: center;
            &:hover {
                .item-shadow {
                    display: flex;
                }
            }
            img {
                max-width: 100%;
                max-height: 100%;
            }
            .item-shadow {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.3);
                justify-content: center;
                align-items: center;
                display: none;
            }
            .item-icon {
                font-size: 20px;
                color: #fff;
                cursor: pointer;
            }
        }
    }

</style>