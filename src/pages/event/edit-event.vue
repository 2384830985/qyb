<template>
    <EventForm :url="'/admin/Regiment/Edit'" :formData="form" :isEdit="true"/>
</template>

<script>
    import {getEditInfo} from '@/api/event'
    import EventForm from './event-form'

    export default {
        data() {
            return {
                form: null
            }
        },
        created() {
            this.getEventInfo()
        },
        computed: {},
        methods: {
            getEventInfo() {
                getEditInfo({
                    params: {
                        id: this.$route.params.id
                    }
                }).then(res => {
                    if (res.resultCode === '0') {
                        this.form = res.result
                        this.form.store_nums = Number(this.form.store_nums)
                    } else {
                        this.$message.success(res.errorMsg)
                    }
                })
            }
        },
        components: {
            EventForm
        }
    }
</script>

<style lang="less">

</style>