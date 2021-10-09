<template>
  <VApp>
    <Header />

    <VMain>
      <router-view />
    </VMain>
  </VApp>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/Header.vue';

export default Vue.extend({
  name: 'App',
  components: { Header },
  data: () => ({
    //
  }),
});
</script>
