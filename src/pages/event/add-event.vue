<template>
    <EventForm url="/admin/Regiment/add" :formData="form"/>
</template>

<script>
    import EventForm from './event-form'

    export default {
        data() {
            return {
                form: {
                    title: '新增活动',
                    intro: '活动结束',
                    banner: 'http://s1.jiguo.com/84752d71-5490-4f4b-88cd-8db5fd87062c',
                    img: ['http://s1.jiguo.com/84752d71-5490-4f4b-88cd-8db5fd87062c', 'http://s1.jiguo.com/5748b3fb-aac8-4d14-bba8-5e92270d7aa1'],
                    need_num: '5',
                    need_price: '1',
                    freight_way: '1',
                    store_nums: 10,
                    unit: '个',
                    rule_desc: '拼团规则简介',
                    start_time: '',
                    end_time: '2018-10-10 20:40:00'
                }
            }
        },
        computed: {},
        methods: {},
        components: {
            EventForm
        }
    }
</script>

<style lang="less">

</style>