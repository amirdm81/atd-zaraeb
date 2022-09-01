import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    zaraeb: [
    {
      year: 86,
      z: 32.358
    },
    {
      year: 87,
      z: 27.125
    },  
    {
      year: 88,
      z: 21.577
    },
    {
      year:89,
      z: 19.375
    },
    {
      year: 90,
      z: 17.261
    },
    {
      year: 91,
      z: 10.420
    },
    {
      year:92,
      z: 7.995
    },
    {
      year: 93,
      z: 5.975
    },
    {
      year: 94,
      z:4.978
    },
    {
      year: 95,
      z:4.75
    },
    {
      year:96,
      z: 4.264
    },
    {
      year:97,
      z: 3.740
    },
    {
      year: 98,
      z: 2.509
    },
    {
      year: 99,
      z:1.820
    },
    {
      year: 400,
      z: 1
    }],
  },
  mutations: {
    add(state,payload) {
      state.zaraeb.push({year:Number(payload.year),z:Number(payload.z)});
    },
    remove(state,payload) {
      state.zaraeb = state.zaraeb.filter(z => z.year !== payload);
    },
    import(state, payload) {
      state.zaraeb = payload;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
