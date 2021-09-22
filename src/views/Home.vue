<template>
  <div>
    <VFileInput v-model="file" truncate-length="15" show-size :loading="processing" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { readFile } from '../helpers/File';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      file: null as File | null,
      processing: false,
    };
  },
  computed: mapState(['activity', 'progress']),

  watch: {
    file(newVal: File | null) {
      console.log(newVal);
      if (newVal === null) return;

      this.readFile(newVal);
    },
  },
  methods: {
    async readFile(file: File) {
      const reader = new FileReader();
      reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
          this.$store.commit('addProgress', percent);
        }
      });

      this.$store.commit('addActivity', await readFile(file, reader));
    },
  },
});
</script>
