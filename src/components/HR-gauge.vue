<template>
  <svg
    style="width: 70%"
    class="d-block mx-auto my-3"
    viewBox="0 0 427 226"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g transform="translate(-33.000000, -688.000000)">
      <g transform="translate(33.553097, 689.320487)" stroke="#FFFFFF">
        <path
          d="M77.4469033,212.281521 C61.8613266,212.286239 36.0456922,212.286239 2.84217094e-14,
            212.281521 C0.00579449537,172.446386 10.5991422,135.273596 31.780043,
            100.76315 C45.6536086,109.556279 67.44499,123.450595 97.1541874,142.446097 C84.2346027,
            163.734983 77.665508,187.013458 77.4469033,212.281521 Z"
          id="Z1"
          fill="#62C7F9"
        ></path>
        <path
          d="M163.518755,86.9956236 C148.295918,47.3742012 139.014284,23.2010861 135.673852,
            14.4762785 C91.2753356,32.0683664 56.6440659,60.8306567 31.780043,100.76315 C60.7456177,
            119.360272 82.5369991,133.254588 97.1541874,142.446097 C113.470352,
            116.553184 135.591875,98.0696934 163.518755,86.9956236 Z"
          id="Z2"
          fill="#007EA7"
        ></path>
        <path
          d="M262.695769,87.6976589 C230.134073,74.9707645 197.075068,74.7367527 163.518755,
            86.9956236 L135.673852,14.4762785 C187.702417,-5.1405506 239.730982,
            -4.82028138 291.759547,15.4370862 C264.037906,85.5039278 311.538314,106.788 262.695769,
            87.6976589 Z"
          id="Z3"
          fill="#A6D175"
        ></path>
        <path
          d="M328.103118,143.329043 C328.528255,143.248446 350.967383,130.30689 395.420502,
            104.504375 C358.737703,39.9196219 292.151283,15.2938658 292.151283,
            15.2938658 C291.840972,15.0477954 282.100458,39.262304 262.92974,87.9373917 C288.543238,
            97.8768725 310.267697,116.340756 328.103118,143.329043 Z"
          id="Z4"
          fill="#FF9F1C"
        ></path>
        <path
          d="M424.987743,212.213281 C391.332451,212.213281 391.332451,212.213281 347.167934,
            212.213281 C347.167934,188.697845 340.812996,165.736432 328.103118,
            143.329043 L395.420502,104.504375 C414.532507,136.134057 424.388254,
            172.037026 424.987743,212.213281 Z"
          id="Z5"
          fill="#EF767A"
        ></path>
      </g>
      <path
        class="arrow"
        :style="`transform: rotate(${angle}deg);`"
        d="M149.5,889.5 L149.5,899.5 L248.5,899.5 L248.5,903.5 L149.5,903.5 L149.5,
          913.5 L125.5,901.5 L149.5,889.5 Z"
        fill="#5D5D5D"
        fill-rule="nonzero"
      ></path>
      <circle
        stroke="#9F9F9F"
        stroke-width="3"
        fill="#5D5D5D"
        cx="246.5"
        cy="901.5"
        r="9"
        style=""
      ></circle>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { getAngle, calculateZones, getZone } from '@/helpers/heat-rate';

export default Vue.extend({
  props: {
    HR: Number,
  },
  computed: {
    ...mapState(['age']),
    angle() {
      const zones = calculateZones(this.age);
      const zone = getZone(this.HR, zones);
      console.log(zone, zones);
      return getAngle(this.HR, zones);
    },
  },
});
</script>
<style lang="sass" scoped>
.arrow
  transform-origin: right
  transform-box: fill-box
  transition: transform 300ms ease-in-out
</style>
