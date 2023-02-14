<script setup lang="ts">
  import {ref, watch, onMounted} from 'vue';

  interface Props {
    currentId: number;
    addAndEditList: string;
    selectListArray: string[];
    youbi: string[];
    todaysDate: any;
    currentRoutines: any;
    isModal: boolean;
  }

  interface Emits {
    (event: 'addNewList', currentId:number, routine:number, customize:number[], addAndEditList:string, stopTodo:string, stopTodoDate:string): void;
    (event: 'closeModal', isModal:boolean): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const isOther = ref(false);

  const localCurrentRoutines = ref(props.currentRoutines);

  const selectRoutineIndex = ref(0);
  
  selectRoutineIndex.value = localCurrentRoutines.value[0];
  const checkYoubiIndex = ref(localCurrentRoutines.value[1]);

  onMounted(
    (): void => {
      isOther.value = (selectRoutineIndex.value===5) ? true : false;
      isStopTodo.value = (stopTodo.value==='nolimit') ? false : true;
    }
  );

  const compareNumber = (a:number, b:number) => {
    return a - b;
  };

  const onAddNewList = () => {
    if(checkYoubiIndex.value.length>0) {
      checkYoubiIndex.value.sort(compareNumber);
    }
    if(stopTodo.value==='nolimit') {
      stopTodoDate.value = '';
    }
    if(selectRoutineIndex.value===5) {
      emit('addNewList', props.currentId, selectRoutineIndex.value, checkYoubiIndex.value, props.addAndEditList, stopTodo.value, stopTodoDate.value);
    }
    else {
      emit('addNewList', props.currentId, selectRoutineIndex.value, [], props.addAndEditList, stopTodo.value, stopTodoDate.value);
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
  const stopTodo = ref(localCurrentRoutines.value[2]);

  watch(stopTodo, 
    ():void => {
      isStopTodo.value = (stopTodo.value==='nolimit') ? false : true;
      stopTodoDate.value = (stopTodo.value==='nolimit') ? '' : stopTodoDate.value;
    }
  );

  const getStopTodoDate = (event:Event) => {
    const targetElm = event.target as HTMLInputElement;
    stopTodoDate.value = targetElm.value;
  };

  const onCloseModal = (event:Event) => {
    emit('closeModal', false);
  };

</script>

<template>
  <div class="modal">
    <div class="modal__inputArea modal__inputArea--radio">
      <ul>
        <li v-for="(data,index) in props.selectListArray" :key="data">
          <input :id="'radio' + index" type="radio" :value="index" v-model="selectRoutineIndex">
          <label :for="'radio' + index">{{ data }}</label>
        </li>
      </ul>
    </div>
    <div v-if="isOther" class="modal__inputArea">
      <ul>
          <li v-for="(data,index) in youbi" :key="data">
          <input :id="'check' + index" type="checkbox" :value="index" v-model="checkYoubiIndex">
          <label :for="'check' + index">{{ data }}</label>        
          </li>
      </ul>
    </div>
    <div class="modal__inputArea modal__inputArea--radio">
      <ul>
        <li>
          <input id="radio_end1" type="radio" value="nolimit" v-model="stopTodo">
          <label for="radio_end1">終了日を指定しない</label>
        </li>
        <li>
          <input id="radio_end2" type="radio" value="limited" v-model="stopTodo">
          <label for="radio_end2">終了日を指定する</label>
        </li>
      </ul>
      <template v-if="isStopTodo">
        <input type="date" :min="stopTodoDate" :max="stopMaxTodoDate" :value="stopTodoDate" @change="getStopTodoDate">
      </template>
    </div>
    <button @click="onAddNewList">保存する</button>
    <span class="modal__closeBtn" @click="onCloseModal">✖️</span>
  </div>
</template>

<style lang="scss" scoped>

$colorFont: #333;
@mixin input {
  list-style: none;
  margin: 0;
  padding: 0;
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
      background: #fff;
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
      background-color: $colorFont;
      border-color: $colorFont;
    }
    &:after {
      transform: rotate(-45deg) scaleX(1);
    }
  }
}

.modal {
  background:rgba($color: #fff, $alpha: 0.8);
  padding: 20px;
  margin: 20px;
  color: #333;
  position: relative;
  &__closeBtn{
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
  &__inputArea {
    padding: 20px 0;
    text-align: left;
    ul {
      @include input;
    }
    li {
      display: inline-block;
    }
    &--radio {
      label::before {
        border-radius: 50%;
      }
    }
  }
  button {
    background: #333;
    color: #fff;
    padding: 10px 30px;
  }
}

</style>
