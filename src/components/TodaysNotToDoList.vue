<script setup lang="ts">
  interface Props {
    id: number;
    list: string;
    date: number;
    selectListArray: string[];
  }
  defineProps<Props>();
  
</script>

<template>
  <ul class="todaysList__list">
    <li>
      <input type="checkbox" :id="id">
      <label :for="id">{{ list }} {{ selectListArray[date] }}</label>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.todaysList {
  &__list {
    li {
      display: inline-flex;
      margin: 0 0 14px 14px;
    }
    input {
      position: absolute;
      height: 0;
      width: 0;
      overflow: hidden;
    }
    label {
      position: relative;
      padding: 0 0 0 20px;
      cursor: pointer;
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        width: 16px;
        height: 16px;
        top: 1px;
        background: #ccc;
        transition: all ease-in 0.1s;
      }
      &:after {
        content: '';
        position: absolute;
        top: 9px;
        left: 5px;
        transform: rotate(-45deg) scaleX(0);
        transform-origin: left;
        width: 11px;
        height: 5px;
        border-left: 3px solid #fff;
        border-bottom: 2px solid #fff;
        transition: transform 0.1s ease-in;
      }
    }
    input:checked + label {
      &:before {
        background-color: #333;
        border-color: #333;
      }
      &:after {
        transform: rotate(-45deg) scaleX(1);
      }
    }
  }
}

</style>
