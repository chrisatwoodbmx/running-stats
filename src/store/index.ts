import Vue from 'vue';
import Vuex from 'vuex';
import Activity from '@/models/Activity';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activityData: {},
    progress: 0,
    activity: {} as Activity,
  },
  mutations: {
    addActivityData(state, data: any) {
      state.activityData = data;
    },
    addActivity(state, activity: Activity) {
      state.activity = activity;
    },
    addProgress(state, progress: number) {
      console.log(progress);
      state.progress = progress;
    },
  },
  actions: {},
  modules: {},
});
