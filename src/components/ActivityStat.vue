<template>
  <div>
    <span v-text="value" aria-labelledby="time-title" class="text-h6 d-block font-weight-regular" />
    <small class="text-subtitle-1 mt-n2 d-block" id="time-title" v-text="title" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LineChart',
  props: {
    title: String,
    value: String,
  },
});
</script>
