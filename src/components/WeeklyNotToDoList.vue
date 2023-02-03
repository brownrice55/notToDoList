<script setup lang="ts">
</script>

<template>
  <div class="weekly">
    <div class="weekly__container" v-for="index in 7" style="background: #ccc;">
      <h3>{{ index }}</h3>
      <ul>
        <li>
          <input type="checkbox" id="">
          <label for="">しないことリストの内容を表示する</label>
        </li>
        <li>
          <input type="checkbox" id="">
          <label for="">しないことリストの内容を表示する</label>
        </li>
        <li>
          <input type="checkbox" id="">
          <label for="">しないことリストの内容を表示する</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.weekly__container {
  display: inline-block;
}
</style>
