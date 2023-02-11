<script setup lang="ts">
  import {ref, watch} from 'vue';

  interface Props {
    currentId: number;
    addAndEditList: string;
    selectListArray: string[];
    youbi: string[];
    todaysDate: any;
  }

  interface Emits {
    (event: 'addNewList', currentId:number, routine:number, customize:number[], addAndEditList:string, stopTodo:string): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const isOther = ref(false);
  const checkYoubiIndex = ref([]);

  const selectRoutineIndex = ref(0);
  selectRoutineIndex.value = 1;

  const onAddNewList = () => {
    if(selectRoutineIndex.value===5) {
      emit('addNewList', props.currentId, selectRoutineIndex.value, checkYoubiIndex.value, props.addAndEditList, stopTodo.value);
    }
    else {
      emit('addNewList', props.currentId, selectRoutineIndex.value, [], props.addAndEditList, stopTodo.value);
    }
  };

  watch(selectRoutineIndex, 
    ():void => {
      isOther.value = (selectRoutineIndex.value===5) ? true : false;
    }
  );

  // 終了日の設定
  const getPeriod = (aYear:number) => {
    const year:number = props.todaysDate.year + aYear;
    const month:string = (props.todaysDate.month<10) ? '0' + props.todaysDate.month : props.todaysDate.month;
    const day:string = (props.todaysDate.day<10) ? '0' + props.todaysDate.day : props.todaysDate.day;
    const date:string = year + '-' + month + '-' + day;
    return date;
  };
  const stopTodoDate = ref(getPeriod(0));
  const stopMaxTodoDate = ref(getPeriod(10));

  const isStopTodo = ref(false);
  const stopTodo = ref('nolimit');

  watch(stopTodo, 
    ():void => {
      isStopTodo.value = (stopTodo.value==='nolimit') ? false : true;
    }
  );

  const getStopTodoDate = (event:Event) => {
    const targetElm = event.target as HTMLInputElement;
    stopTodo.value = targetElm.value;
    stopTodoDate.value = targetElm.value;
  };

</script>

<template>
  <ul>
    <li v-for="(data,index) in props.selectListArray" :key="data">
      <input :id="'radio' + index" type="radio" :value="index" v-model="selectRoutineIndex">
      <label :for="'radio' + index">{{ data }}</label>
    </li>
  </ul>
  <div v-if="isOther">
    <ul>
        <li v-for="(data,index) in youbi" :key="data">
        <input :id="'check' + index" type="checkbox" :value="index" v-model="checkYoubiIndex">
        <label :for="'check' + index">{{ data }}</label>        
        </li>
    </ul>
  </div>
  <div class="settings__inputArea__stop">
    <input id="radio_end1" type="radio" value="nolimit" v-model="stopTodo">
    <label for="radio_end1">終了日を指定しない</label>
    <input id="radio_end2" type="radio" :value="stopTodoDate" @click="getStopTodoDate">
    <label for="radio_end2">終了日を指定する</label>
    <template v-if="isStopTodo">
      <input type="date" :min="stopTodoDate" :max="stopMaxTodoDate" :value="stopTodoDate" @change="getStopTodoDate">
    </template>
  </div>
  <button @click="onAddNewList">保存する</button>
</template>

<style lang="scss" scoped>
.settings__inputArea {
  li {
    display: inline-block;
    padding: 20px;
  }
  input[type="radio"] {
    border: 1px solid #ccc;
  }
  &__stop {
    padding: 10px;
  }
}
</style>
