import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  isLogin: false
};

const getters = {
  loginState(state) {
    return state.isLogin;
  }
};

const actions = {
  login({commit}) {
    commit('LOGIN');
  },
  logout({commit}) {
    commit('LOGOUT');
  }
};

const mutations = {
  LOGIN(state) {
    state.isLogin = true;
  },
  LOGOUT(state) {
    state.isLogin = false;
  },
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
