import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activity: {},
    progress: 0,
  },
  mutations: {
    addActivity(state, data: any) {
      state.activity = data;
    },
    addProgress(state, progress: number) {
      console.log(progress);
      state.progress = progress;
    },
  },
  actions: {},
  modules: {},
});
