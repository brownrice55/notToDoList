<script setup lang="ts">
  import {ref} from 'vue';

  interface Props {
    weeklyNotTodoList: any;
    past7Days: any;
    youbi: string[];
    past7DaysMs: number[];
    todayMs: number;
  }

  const props = defineProps<Props>();

</script>

<template>
  <div class="weekly">
    <div class="weekly__container" v-for="(val, index) in props.past7Days" :key="val">
      <h3>{{ val.year }}年{{ val.month }}月{{ val.day }}日（{{ props.youbi[val.youbi] }}）</h3>
      <template v-for="[id, data] in weeklyNotTodoList" :key="id">
        <ul>
          <li v-for="[id2, data2] in data.data" :key="data2">
            <template v-if="(id===props.past7DaysMs[index])">
            <input type="checkbox" :id="'check' + id2 + '_' + data2.id" :checked="data2.done">
            <label :for="'check' + id2 + '_' + data2.id" :class="data2.done?'done':''">{{ data2.list }}</label>
            </template>
            <template v-else-if="data2.id==0 && id!==todayMs">
              <li>この日のアプリの使用はありません。</li>
            </template>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weekly {
  width: 100%;
  &__container {
    width: 100%;
    li {
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
      span {
        font-size: 80%;
        background: #eee;
      }
      &.done {
        text-decoration: line-through;
      }
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
