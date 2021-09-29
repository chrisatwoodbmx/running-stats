<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  data() {
    return {};
  },
  computed: {
    ...mapState({
      activity: 'activity',
    }),
  },
  methods: {},
});
</script>
