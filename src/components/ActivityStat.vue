<template>
  <div class="d-flex">
    <div class="">
      <span
        v-text="value"
        aria-labelledby="time-title"
        class="text-h6 d-block font-weight-regular"
      />
      <small class="text-subtitle-1 mt-n2 d-block" id="time-title" v-text="title" />
    </div>
    <VDivider vertical class="align-self-center ml-12" style="height: 30px;" v-if="includeBorder" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LineChart',
  props: {
    title: String,
    value: String,
    includeBorder: Boolean,
  },
});
</script>
