<script setup lang="ts">
  interface Props {
    id: number;
    list: string;
    date: string;
  }
  defineProps<Props>();
</script>

<template>
  <ul>
    <li>
      <input type="checkbox" :id="id">
      <label :for="id">{{ list }} {{ date }}</label>
    </li>
  </ul>
</template>

<style lang="scss" scoped>

</style>
