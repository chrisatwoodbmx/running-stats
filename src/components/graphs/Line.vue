<template>
  <Chart :options="options" />
</template>

<script lang="ts">
import Vue from 'vue';
import { Chart } from 'highcharts-vue';

export default Vue.extend({
  name: 'LineChart',
  props: ['options'],
  components: { Chart },
});
</script>
