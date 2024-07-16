import { createStore } from 'vuex';
import Cookies from 'js-cookie';

export default createStore({
  state: {
    user: null //accountid
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // 设置 cookie，7 天后过期
    },
    clearUser(state) {
      state.user = null;
      Cookies.remove('user');
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('clearUser');
    },
    checkUser({ commit }) {
      const user = Cookies.get('user');
      if (user) {
        commit('setUser', JSON.parse(user));
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    getUser: state => state.user,
    getUserPermission: state => state.user ? state.user.permission : null
  }
});
