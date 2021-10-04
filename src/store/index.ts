import Vue from 'vue';
import Vuex from 'vuex';
import Activity, { SPLIT } from '@/models/Activity';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activityData: {},
    progress: 0,
    activity: {} as Activity,
    split: SPLIT,
  },
  mutations: {
    addActivityData(state, data: any) {
      state.activityData = data;
    },
    addActivity(state, activity: Activity) {
      state.activity = activity;
    },
    addProgress(state, progress: number) {
      state.progress = progress;
    },
    setSplit(state, split: typeof SPLIT) {
      state.split = split;
    },
  },
  actions: {},
  modules: {},
});
