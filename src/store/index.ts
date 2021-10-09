import Vue from 'vue';
import Vuex from 'vuex';
import Activity from '@/models/Activity';
import { SPLIT } from '@/helpers/Units';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activityData: {},
    progress: 0,
    activity: {} as Activity,
    split: SPLIT.KM,
    processing: false,
    age: 22,
  },
  mutations: {
    addActivityData(state, data: any) {
      state.activityData = data;
    },
    addActivity(state, activity: Activity) {
      console.log('UPDATE', activity);
      state.activity = activity;
    },
    addProgress(state, progress: number) {
      state.progress = progress;
    },
    setProcessing(state, value: boolean) {
      state.processing = value;
    },
    setSplit(state, split: SPLIT) {
      state.split = split;
    },
    setAge(state, age: number) {
      state.age = age;
    },
  },
  actions: {},
  modules: {},
});
