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

  const showDate = (aIndex:number) => {
    let date = props.past7Days[aIndex];
    let showDateStr = date.year + '年' + date.month + '月' + date.day + '日（' + props.youbi[date.youbi] + '）';
    return showDateStr;
  };

  const isPastData = (aId:number, aIndex:number) => {
    let result = (aId===props.past7DaysMs[aIndex]) ? true: false;
    return result;
  };

</script>

<template>
  <div class="weekly">
    <div class="weekly__container" v-for="(val, index) in props.past7DaysMs" :key="val">
      <h3>{{ showDate(index) }}</h3>
      <div class="weekly__container">
        <template v-for="[id, data] in weeklyNotTodoList" :key="id">
          <ul>
            <li v-for="[id2, data2] in data.data" :key="data2">
              <template v-if="isPastData(id, index)">
                <input type="checkbox" :id="'check' + id2 + '_' + data2.id" :checked="data2.done">
                <label :for="'check' + id2 + '_' + data2.id" :class="data2.done?'done':''">{{ data2.list }}</label>
              </template>
              <template v-else-if="data2.id==0 && id!==todayMs">
                この日のアプリの使用はありません。
              </template>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weekly {
  width: 100%;
  &__container {
    width: 100%;
    @include inputCheckList;
  }
}

</style>
