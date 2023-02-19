<script setup lang="ts">
  import {getShowRoutine} from './modules/getShowRoutine'

  interface Props {
    todaysDate: any;
    todaysNotTodoList: any;
    selectListArray: string[];
    youbi: string[];
  }

  interface Emits {
    (event: 'checkDoneList', id:number, done:boolean): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const checkDoneTodo = (aId:number, aDone:boolean): void => {
    const e:any = event;
    const inputElm = e.target as HTMLInputElement;
    const labelElm = inputElm.nextSibling as HTMLElement;
    labelElm.classList.toggle('done');
    aDone = !aDone; 
    // doneにデータを追加してローカルストレージに保管する
    emit('checkDoneList', aId, aDone);
  };

</script>

<template>
  <h2 class="todaysList__title">{{ props.todaysDate.year }}年{{ props.todaysDate.month }}月{{ props.todaysDate.day }}日（{{ props.youbi[props.todaysDate.youbi] }}）のしないことリスト</h2>
  <ul class="todaysList__list">
    <template v-for="[id, data] in props.todaysNotTodoList" :key="id">
      <li>
        <input type="checkbox" :id="'check' + id" :checked="data.done" @change="checkDoneTodo(data.id, data.done)">
        <label :for="'check' + id" :class="data.done?'done':''">{{ data.list }}<span>{{ getShowRoutine(data.routine, data.customize, props.selectListArray, props.youbi) }}</span></label>
      </li>
    </template>
  </ul>

</template>

<style lang="scss" scoped>
.todaysList {
  &__list {
    @include inputCheckList;
  }
}
</style>
