<template>
  <div>
    <svg v-if="tile.type == 'Triangle'" width="56" height="48" viewBox="0 0 56 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.7128 0L55.4256 48H0L27.7128 0Z" fill="#43A9AF" />
      <text x="40%" y="70%" font-family="Verdana" font-size="20" fill="#C4C4C4">{{ tile.value }}</text>
    </svg>
    <svg v-if="tile.type == 'Square'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M0 0H64V64H0V0Z" fill="#43A9AF" />
      <text x="40%" y="70%" font-family="Verdana" font-size="20" fill="#C4C4C4">{{ tile.value }}</text>
    </svg>
    <svg v-if="tile.type == 'Pentagon'" xmlns="http://www.w3.org/2000/svg" width="62" height="58" viewBox="0 0 62 58" fill="none">
      <path d="M31 0L61.4338 22.1115L49.8091 57.8885H12.1909L0.566191 22.1115L31 0Z" fill="#43A9AF" />
      <text x="40%" y="70%" font-family="Verdana" font-size="20" fill="#C4C4C4">{{ tile.value }}</text>
    </svg>
    <svg v-if="tile.type == 'Hexagon'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 0L59.7128 16V48L32 64L4.28719 48V16L32 0Z" fill="#43A9AF" />
      <text x="30%" y="60%" font-family="Verdana" font-size="20" fill="#C4C4C4">{{ tile.value }}</text>
    </svg>
    <svg v-if="tile.type == 'Blank'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#C4C4C4" />
      <line x1="8.66214" y1="54.6314" x2="56.6621" y2="10.6314" stroke="#9C9C9C" />
      <line x1="9.33786" y1="10.6314" x2="57.3379" y2="54.6314" stroke="#9C9C9C" />
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Tile } from '../../../backend/src/Room';

export default Vue.extend({
    props: {
        tile: {
            type: Object as () => Tile
        }
    }
});
</script>