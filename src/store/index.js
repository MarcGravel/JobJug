import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'
import axios from 'axios'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: undefined,
  },
  mutations: {
    userData (state, info) {
      state.userInfo = info;
    } 
  },
  actions: {
    getUserInfo() {
      let session = cookies.get('session') 

      axios.request({
        url: process.env.VUE_APP_API_SITE+'/api/users',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'sessionToken': session.token
        },
        params: {
            'userId': session.userId
        }
    }).then((response) => {
      return this.commit('userData', response.data[0]);
    }).catch((error) => {
        console.log(error.response.data);
    })
    }
  },
  modules: {
  }
})
