<template>
    <div class="product-check-list">
        <ProductSearch :page_type="page_type" @getList="getList"/>
        <ProductList :page_type="page_type" :list="list"/>
    </div>
</template>

<script>
    import ProductSearch from './product-search'
    import ProductList from './product-list'

    export default {
        data() {
            return {
                page_type: "online",
                list: null
            }
        },
        methods: {
            getList(list) {
                this.list = list
            }
        },
        components: {
            ProductList,
            ProductSearch
        }
    }
</script>

<style lang="less">

</style>