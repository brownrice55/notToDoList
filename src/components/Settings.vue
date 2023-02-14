<script setup lang="ts">
  import {ref, watch} from 'vue';
  import ModalSelectRoutine from './ModalSelectRoutine.vue'

  const disabledClass = ref('disabled');

  interface Props {
    notTodoList: any;
    selectListArray: string[];
    youbi: string[];
    isNotTodoData: boolean;
    todaysDate: any;
    todayMs: number;
  }

  interface Emits {
    (event: 'editList', id:number, list:string): void;
    (event: 'addNewList', id:number, routine:number, customize:number[], list:string, stopTodo:string, stopTodoDate:string): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const onEditListBtnClick = (aId:number, aList:string): void => {
    emit('editList', aId, aList);
  };

  const onEditList = (event:Event): void => {
    const targetElm =  event.target as HTMLElement;
    const parentElm = targetElm.parentNode as HTMLDivElement;
    parentElm.classList.toggle('disabled');
    const focusElm = targetElm.previousSibling as HTMLElement;
    focusElm.focus();
  };

  const editListAlert = ref('');
  const onSaveList = (aId:number, aList:string): void => {
    const e:any = event;
    const targetElm = e.target as HTMLInputElement;
    if(!targetElm.value) {
      editListAlert.value = 'しないことを入力してください。';
      targetElm.focus();
      return;
    }
    if(targetElm.value.length>30) {
      editListAlert.value = '30文字以内で入力してください。';
      targetElm.focus();
      return;
    }
    editListAlert.value = '';
    const targetParentElm =  targetElm.parentNode as HTMLElement;
    targetParentElm.classList.toggle('disabled');
    if(targetElm.value!==aList) {
      onEditListBtnClick(aId, targetElm.value);
    }
  };

  const inputListAlert = ref('');
  const inputList = ref('');
  const addAndEditList = ref('');

  // 新規入力の頻度のモーダル部分
  const isModal = ref(false);
  const currentId = ref(100000);//100000は新規追加の時
  const currentRoutines:any = ref([0,[],'nolimit']);
  const onChangeRoutine = (aId:number, aList:string, aRoutine:number, aCustomize:number[], aStopTodo:string, aStopTodoDate:string): void => {
    currentId.value = aId;
    currentRoutines.value = [aRoutine, aCustomize, aStopTodo];
    addAndEditList.value = aList;
    if(!inputList.value.length && aId===100000) {
      inputListAlert.value = 'しないことを入力してください。';
      return;
    }
    isModal.value = !isModal.value;
  };

  const notTodoListState = ref();

  const onAddNewList = (currentId:number, routine:number, customize:number[], aInputList:string, stopTodo:string, stopTodoDate:string) : void => {
    isModal.value = !isModal.value;
    if(customize.length) {
      if(routine===5) {
        if(customize.length==8 && customize[0]===0 && customize[7]===7) {//毎日の時
          routine = 0;
        }
        else if(customize.length==5 && customize[0]===1 && customize[4]===5) {//平日だけ（祝日含まない）の時
          routine = 1;
        }
        else if(customize.length==6 && customize[0]===1 && customize[5]===7) {//平日だけ（祝日含む）の時
          routine = 2;
        }
        else if(customize.length==2 && customize[0]===0 && customize[1]===6) {//土日だけの時
          routine = 3;
        }
        else if(customize.length==3 && customize[0]===0 && customize[2]===7) {//土日祝だけの時
          routine = 4;
        }
      }
    }
    emit('addNewList', currentId, routine, customize, aInputList, stopTodo, stopTodoDate);
    notTodoListState.value = getNotTodoListState(props.notTodoList);
    if(currentId===100000) {
      inputList.value = '';
    }
  };

  watch(inputList, 
    ():void => {
      inputListAlert.value = (inputList.value.length>30) ? '30字以内で入力してください' : '';
    }
  );

  const showRoutine = (aRoutine:number, aCustomize:number[]) => {
    if(aRoutine===5) {
      let showCustomizeYoubi:string = '';
      for(let cnt=0,len=aCustomize.length;cnt<len;++cnt) {
        let showYoubi = (aCustomize[cnt]!==7) ? '曜日' : '日';
        showCustomizeYoubi += props.youbi[aCustomize[cnt]] + showYoubi;
        if(cnt<len-1) {
          showCustomizeYoubi += '、';
        }
      }
      return showCustomizeYoubi;
    }
    else {
      return props.selectListArray[aRoutine];
    }
  };

  const showStopPeriod = (aStopTodo:string, aStopTodoDate:string) => {
    if(aStopTodo==='nolimit') {
      return '期限:なし';
    }
    else {
      return '期限:' + aStopTodoDate + 'まで';
    }
  };

  interface notTodoListType {
    id: number;
    list: string;
    routine: number;
    stop: string;
    done: boolean;
    customize: number[];
    stopTodoDate: string;
  }
  
  const getNotTodoListState = (aData:any) => {
    const newListNow = new Map<number, notTodoListType>();
    const newListStop = new Map<number, notTodoListType>();
    aData.forEach((val:notTodoListType, key:number) => {
      if(val.stop==='nolimit' || new Date(val.stopTodoDate).getTime()-props.todayMs>=0) {
        newListNow.set(key, val);
      }
      else {
        newListStop.set(key, val);
      }
    });
    return [newListNow, newListStop];
  };

  notTodoListState.value = getNotTodoListState(props.notTodoList);

  const onCloseModal = (aIsModal:boolean) => {
    isModal.value = aIsModal;
  }

</script>

<template>
  <h2>設定</h2>
  <p>あなたは<b>何をしない</b>ですか？</p>
  <div class="settings___desc">
    {{ inputListAlert }}
  </div>
  <div class="settings__inputArea">
    <input type="text" v-model="inputList">
    <div class="settings__inputArea__btnWrap">
      <button @click="onChangeRoutine(100000, inputList, 0, [], 'nolimit','')">追加</button>
    </div>
  </div>
  <div class="settings___desc">
    <p>例）21時以降はブルーライトを浴びない</p>
  </div>
  <div v-if="isModal" class="overlay">
    <ModalSelectRoutine :selectListArray="selectListArray" :youbi="youbi" :currentId="currentId" :currentRoutines="currentRoutines" :addAndEditList="addAndEditList" :todaysDate="todaysDate" :isModal="isModal" @addNewList="onAddNewList" @closeModal="onCloseModal"></ModalSelectRoutine>
  </div>
  <div class="settings__listArea" v-if="props.isNotTodoData">
    <h3>しないことリスト</h3>
    <template v-if="notTodoListState[0].size">
      <h4>現在進行中のリスト</h4>
      <ul>
        <li v-for="[id, data] in notTodoListState[0]" :key="data">
          <div class="settings__listArea__list">
            <div :class="disabledClass">
              <span>{{ showRoutine(data.routine, data.customize) }}</span><br>
              <span>{{ showStopPeriod(data.stop, data.stopTodoDate) }}</span>
              <i class="fas fa-edit" @click="onChangeRoutine(id, data.list, data.routine, data.customize, data.stop, data.stopTodoDate)"></i>
            </div>
            <div :class="disabledClass">
              <input type="text" :value="data.list" @blur="onSaveList(id, data.list)">
              <i class="fas fa-edit" @click="onEditList"></i>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template v-if="notTodoListState[1].size">
      <h4>終了済みのリスト</h4>
      <ul>
        <li v-for="[id, data] in notTodoListState[1]" :key="data">
          <div class="settings__listArea__list">
            <div :class="disabledClass">
              <span>{{ showRoutine(data.routine, data.customize) }}</span><br>
              <span>{{ showStopPeriod(data.stop, data.stopTodoDate) }}</span>
              <i class="fas fa-edit" @click="onChangeRoutine(id, data.list, data.routine, data.customize, data.stop, data.stopTodoDate)"></i>
            </div>
            <div :class="disabledClass">
              <input type="text" :value="data.list" @blur="onSaveList(id, data.list)">
              <i class="fas fa-edit" @click="onEditList"></i>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';
@function rem($px) {
  @return math.div($px, 16px) * 1rem;
}

.settings {
  b {
    font-weight: bold;
  }
  &__inputArea {
    position:relative;
    width: 100%;
    input {
      width: 100%;
      padding: 10px;
      background: #eee;
    }
    select {
      padding: 10px;
    }
    &__btnWrap {
      position: absolute;
      top: 0;
      right: 0;
      background: #000;
      color: #fff;
      padding: 9px;
      border-radius: 0 4px 4px 0;
    }
  }
  &___desc {
    padding: 10px 0;
    font-size: rem(12px);
  }
  &__listArea {
    li {
      padding: 10px 0;
      margin: 0 0 10px;
      border: 1px solid #ddd;
      list-style: none;
    }
    &__list {
      padding: 0 10px;
      div {
        position: relative;
        display: block;
        span {
          display: inline-block;
        }
      }
      .disabled {
        span, input {
          pointer-events: none;
          border: none;
          color: #999;
        }
        i {
          display: inline-block;
        }
      }
      input {
        width:90%;
        padding: 5px;
        margin: 5px 10px;
      }
      select {
        margin: 0;
        padding: 5px;
      }
      i {
        margin: 5px;
        cursor: pointer;
        display: none;
      }
    }
    &__btnWrap {
      text-align: center;
      button {
        margin: 0 5px;
      }
    }
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  z-index: 20;
  color: #fff;
}
</style>
