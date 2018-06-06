const product = {
    state: {
        list: {
            isLoading: false
        }
    },
    mutations: {
        updateLoading(state, isLoading) {
            state.list.isLoading = isLoading
        }
    }
}

export default product