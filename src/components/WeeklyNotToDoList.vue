<script setup lang="ts">

interface Props {
  weeklyNotToDoList: any;
  past7Days: any;
}

const props = defineProps<Props>();

console.log(props.past7Days);

</script>

<template>
  <div class="weekly">
    <div class="weekly__container" v-for="data in props.past7Days">
      <h3>{{ data.year }}年{{ data.month }}月{{ data.day }}日</h3>
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

<style lang="scss" scoped>
.weekly__container {
  display: inline-block;
}
</style>
