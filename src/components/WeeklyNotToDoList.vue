<script setup lang="ts">

  interface Props {
    weeklyNotTodoList: any;
    past7Days: any;
    youbi: string[];
    past7DaysMs: number[];
    todayMs: number;
  }

  interface Emits {
    (event: 'checkDoneListWeekly', weeklyMs:number, id:number, done:boolean): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const showDate = (aIndex:number) => {
    let date = props.past7Days[aIndex];
    let showDateStr = date.year + '年' + date.month + '月' + date.day + '日（' + props.youbi[date.youbi] + '）';
    return showDateStr;
  };
  let index = 0;
  let cntDataExist = 0;
  const isPastData = (aId:number, aIndex:number) => {
    if(index===aIndex) {
      cntDataExist = 0;
      index++;
    }
    let result = (aId===props.past7DaysMs[aIndex]) ? true: false;
    if(result) {
      cntDataExist++;
    }
    return result;
  };

  const isUnUsed = () => {
    if(cntDataExist===0) {
      return true;
    }
    return false;
  };

  const checkDoneTodoWeekly = (aWeeklyMs:number, aId:number): void => {
    const e:any = event;
    const inputElm = e.target as HTMLInputElement;
    const labelElm = inputElm.nextSibling as HTMLElement;
    labelElm.classList.toggle('done');
    emit('checkDoneListWeekly', aWeeklyMs, aId, inputElm.checked);
  };

</script>

<template>
  <div class="weekly">
    <h2>過去7日間のリスト</h2>
    <div class="weekly__container" v-for="(val, index) in props.past7DaysMs" :key="val">
      <h3>{{ showDate(index) }}</h3>
      <div class="weekly__container">
        <template v-for="[id, data] in weeklyNotTodoList" :key="id">
          <ul>
            <li v-for="[id2, data2] in data.data" :key="data2">
              <template v-if="isPastData(id, index)">
                <input type="checkbox" :id="'check' + id + '_' + data2.id" :checked="data2.done" @change="checkDoneTodoWeekly(id ,data2.id)">
                <label :for="'check' + id + '_' + data2.id" :class="data2.done?'done':''">{{ data2.list }}</label>
              </template>
            </li>
          </ul>
        </template>
        <ul v-if="isUnUsed()">
          <li>
            この日のデータはありません。
          </li>
        </ul>
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
