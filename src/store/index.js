import Vue from 'vue'
import Vuex from 'vuex'
import product from './module/product'
import {getCheckNum} from '@/api/other'
import {Message} from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: {
            uid: 0,
            username: ''
        },
        checkNum: {
            goods_check_num: '',
            regiment_check_num: ''
        }
    },
    mutations: {
        updateUserInfo(state, userInfo) {
            state.userInfo.uid = userInfo.uid
            state.userInfo.username = userInfo.username
        },
        updateCheckNum(state, checkNum) {
            state.checkNum = {...checkNum}
        }
    },
    actions: {
        getUpdateCheckNum({commit}) {
            getCheckNum().then(res => {
                if (res.resultCode === '0') {
                    commit('updateCheckNum', res.result)
                } else {
                    Message({
                        message: res.errorMsg,
                        type: 'error'
                    })
                }
            })
        }
    },
    modules: {
        product
    }
})
