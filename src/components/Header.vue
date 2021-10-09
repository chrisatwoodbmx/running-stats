<template>
  <VAppBar app color="white" dark>
    <div class="d-flex align-center">
      <vImg
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-light.png"
        transition="scale-transition"
        width="40"
      />

      <vImg
        alt="Vuetify Name"
        class="shrink mt-1 hidden-smAnd-down"
        contain
        min-width="100"
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-light.png"
        width="100"
      />
    </div>

    <VSpacer />

    <VMenu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <VBtn icon v-bind="attrs" v-on="on" light>
          <VIcon dark>mdi-cog-outline</VIcon>
        </VBtn>
      </template>

      <VCard>
        <VList>
          <VListItem two-line>
            <VListItemContent>
              <VListItemTitle>Split</VListItemTitle>
            </VListItemContent>
            <VListItemAction>
              <VSelect v-model="split" :items="splits" :loading="processing"></VSelect>
            </VListItemAction>
          </VListItem>

          <VListItem>
            <VListItemContent>
              <VListItemTitle>Your age</VListItemTitle>
              <VListItemSubtitle>This is used to calcuate HR zones</VListItemSubtitle>
            </VListItemContent>
            <VListItemAction>
              <VTextField v-model="age" :loading="processing"></VTextField>
            </VListItemAction>
          </VListItem>
        </VList>
      </VCard>
    </VMenu>
  </VAppBar>
</template>

<script lang="ts">
import Vue from 'vue';
import { SPLIT } from '@/models/Activity';

export default Vue.extend({
  computed: {
    processing: {
      get() {
        return this.$store.state.processing;
      },
    },
    age: {
      get() {
        return this.$store.state.age;
      },
      set(age: number) {
        this.$store.commit('setAge', age);
      },
    },
    split: {
      get() {
        return this.$store.state.split;
      },
      set(split: number) {
        this.$store.commit('setSplit', split);
      },
    },
  },
  data() {
    return {
      menu: false,
      splits: [
        { value: SPLIT.KM, text: 'KMs' },
        { value: SPLIT.MILE, text: 'Miles' },
        { value: SPLIT.LAP, text: '400m laps' },
      ],
    };
  },
});
</script>
