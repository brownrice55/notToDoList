<script setup lang="ts">
import TodaysNotToDoList from './components/TodaysNotToDoList.vue'
import WeeklyNotToDoList from './components/WeeklyNotToDoList.vue'
import Total from './components/Total.vue'
import Settings from './components/Settings.vue'
import ModalSelectRoutine from './components/ModalSelectRoutine.vue'

import {ref, onMounted, watch} from 'vue';

const activeClass = ref('');
const activeClassCnt = ref(0);
const showPageKey = ref('');
const isNotToDoData = ref(true);
const inputListAlert = ref('');

let notToDoList = new Map<number, notToDoListType>();
const notToDoListJsonStr = localStorage.getItem('notToDoList');

if(notToDoListJsonStr!=='undefined') {
  const notToDoListJson = JSON.parse(notToDoListJsonStr);
  notToDoList = new Map<number, notToDoListType>(notToDoListJson);
}

interface notToDoListType {
  id: number;
  list: string;
  date: number;
  stop: number;
  done: boolean;
  customize: number[];
}

const weekyListData = JSON.parse(localStorage.getItem('weeklyNotToDoList'));
const totalData = JSON.parse(localStorage.getItem('totalNotToDoList'));

onMounted(
  (): void => {
    showPageKey.value = (notToDoListJsonStr) ? 'todaysList': 'settings';
    isNotToDoData.value = (notToDoListJsonStr) ? true: false;
  }
);

const onOpenMenu = (): void => {
  activeClass.value = (activeClassCnt.value%2===0) ? 'active' : '';
  activeClassCnt.value++;
};

const showPage = (aPage: string): void => {
  activeClass.value = (activeClassCnt.value%2===0) ? 'active' : '';
  activeClassCnt.value++;
  showPageKey.value = aPage;
};

// TodaysNotToDoList
const youbi:string[] = ['日','月','火','水','木','金','土','祝'];
const today = new Date();
const todaysDate = { year:today.getFullYear(), month:(today.getMonth()+1), day:today.getDate(), youbi:today.getDay() };

const onCheckDoneList = (id:number, done:boolean) : void => {
  const editData = notToDoList.get(id);
  if(editData) {
    notToDoList.set(id, {id:id, list:editData.list, date:editData.date, customize:editData.customize, stop:0, done:done});
  }
  localStorage.setItem('notToDoList', JSON.stringify([...notToDoList]));
}

// WeeklyNotToDoList
const yesterday = new Date(today.setDate(today.getDate()-1));
const twodaysbefore = new Date(yesterday.setDate(yesterday.getDate()-1));
const threedaysbefore = new Date(yesterday.setDate(yesterday.getDate()-1));
const fourdaysbefore = new Date(yesterday.setDate(yesterday.getDate()-1));
const fivedaysbefore = new Date(yesterday.setDate(yesterday.getDate()-1));
const sixdaysbefore = new Date(yesterday.setDate(yesterday.getDate()-1));
const sevendaysbefore = new Date(yesterday.setDate(yesterday.getDate()-1));
const past7Days:any[] = Array(7).fill(Array(4).fill(''));
past7Days[0] = { year:yesterday.getFullYear(), month:(yesterday.getMonth()+1), day:yesterday.getDate(), youbi:youbi[yesterday.getDay()] };
past7Days[1] = { year:twodaysbefore.getFullYear(), month:(twodaysbefore.getMonth()+1), day:twodaysbefore.getDate(), youbi:youbi[twodaysbefore.getDay()] };
past7Days[2] = { year:threedaysbefore.getFullYear(), month:(threedaysbefore.getMonth()+1), day:threedaysbefore.getDate(), youbi:youbi[threedaysbefore.getDay()] };
past7Days[3] = { year:fourdaysbefore.getFullYear(), month:(fourdaysbefore.getMonth()+1), day:fourdaysbefore.getDate(), youbi:youbi[fourdaysbefore.getDay()] };
past7Days[4] = { year:fivedaysbefore.getFullYear(), month:(fivedaysbefore.getMonth()+1), day:fivedaysbefore.getDate(), youbi:youbi[fivedaysbefore.getDay()] };
past7Days[5] = { year:sixdaysbefore.getFullYear(), month:(sixdaysbefore.getMonth()+1), day:sixdaysbefore.getDate(), youbi:youbi[sixdaysbefore.getDay()] };
past7Days[6] = { year:sevendaysbefore.getFullYear(), month:(sevendaysbefore.getMonth()+1), day:sevendaysbefore.getDate(), youbi:youbi[sevendaysbefore.getDay()] };

// Settings
const selectListIndex = ref(0);
const selectListArray: string[] = ['毎日', '平日だけ（祝日含まない）', '平日だけ（祝日含む）', '土日だけ', '土日祝だけ', 'その他'];
const inputList = ref('');
const listDataArray = ref([]);

// 新規入力の頻度のモーダル部分
const isModal = ref(false);
const onChangeRoutine = (): void => {
  if(!inputList.value.length) {
    inputListAlert.value = 'しないことを入力してください。';
    return;
  }
  isModal.value = !isModal.value;
};

const compareNumber = (a:number, b:number) => {
  return a - b;
};

const onAddNewList = (routine:number, customize:number[]) : void => {
  isModal.value = !isModal.value;

  if(customize.length) {
    customize.sort(compareNumber);

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

  const notToDoListArray = [...notToDoList];
  notToDoList.set(notToDoListArray.length, {id:notToDoListArray.length, list:inputList.value, date:routine, customize:customize, stop:0, done:false});
  localStorage.setItem('notToDoList', JSON.stringify([...notToDoList]));
  inputList.value = '';
  selectListIndex.value = 0;
  if(!isNotToDoData.value) {
    isNotToDoData.value = true;
  }
};

const onEditList = (id:number, aEditedDate:number, aEditedList:string) : void => {
  const editData = notToDoList.get(id);
  if(editData===undefined) { return; }
  if(aEditedList!=='undefined') {
    notToDoList.set(id, {id:id, list:aEditedList, date:editData.date, customize:editData.customize, stop:0, done:false});
  }
  else if(aEditedDate!==1000) {
    notToDoList.set(id, {id:id, list:editData.list, date:aEditedDate, customize:editData.customize, stop:0, done:false});
  }
  localStorage.setItem('notToDoList', JSON.stringify([...notToDoList]));
};

watch(inputList, 
  ():void => {
    inputListAlert.value = (inputList.value.length>30) ? '30字以内で入力してください' : '';
  }
);

const isTodaysList = (aDate:number, aCustomize:number[]) => {
  if(aDate==0) {//毎日の時
    return true;
  }
  if(aDate==1 && todaysDate.youbi!==0 && todaysDate.youbi!==6) {//平日の時
    return true;
  }
  if(aDate==2 && todaysDate.youbi===0 || todaysDate.youbi===6) {//土日の時
    return true;
  }
  if(aDate==5) {//その他の時
    const isToday = (aCustomize.some(val => val===todaysDate.youbi)) ? true : false;
    if(isToday) {
      return true;
    }
  }
  return false;
};
</script>

<template>
  <header class="header" v-if="isNotToDoData">
    <button class="header__openBtn" @click="onOpenMenu" :class="activeClass">menu</button>
    <nav class="header__nav" :class="activeClass">
      <ul>
        <li @click="showPage('todaysList')" v-if="notToDoList">今日のリスト</li>
        <li @click="showPage('weeklyList')" v-if="weekyListData">今週のリスト</li>
        <li @click="showPage('total')" v-if="totalData">集計結果</li>
        <li @click="showPage('settings')">設定</li>
      </ul>
    </nav>
  </header>

  <main class="main">
    <section v-if="showPageKey==='todaysList'" class="todaysList">
      <h2 class="todaysList__title">{{ todaysDate.year }}年{{ todaysDate.month }}月{{ todaysDate.day }}日（{{ youbi[todaysDate.youbi] }}）のしないことリスト</h2>
      <ul class="todaysList__list">
        <template v-for="[id, data] in notToDoList" :key="id">
          <TodaysNotToDoList v-if="isTodaysList(data.date, data.customize)" :list="data.list" :id="id" :date="data.date" :customize="data.customize" :done="data.done" :selectListArray="selectListArray" :youbi="youbi" @checkDoneList="onCheckDoneList" />
        </template>
      </ul>
    </section>
    <section v-if="showPageKey==='weeklyList'" class="weeklyList">
      <WeeklyNotToDoList />
    </section>
    <section v-if="showPageKey==='total'" class="total">
      <Total />
    </section>
    <section v-if="showPageKey==='settings'" class="settings">
      <h2>設定</h2>
      <p>あなたは<b>何をしない</b>ですか？</p>
      <div class="settings___desc">
        {{ inputListAlert }}
      </div>
      <div class="settings__inputArea">
        <input type="text" v-model="inputList">
        <div class="settings__inputArea__btnWrap">
          <button @click="onChangeRoutine">追加</button>
        </div>
      </div>
      <div class="settings___desc">
        <p>例）21時以降はブルーライトを浴びない</p>
      </div>
      <div v-if="isModal" class="overlay">
        <ModalSelectRoutine :selectListArray="selectListArray" :youbi="youbi" @addNewList="onAddNewList"></ModalSelectRoutine>
      </div>
      <div class="settings__listArea" v-if="isNotToDoData">
        <h3>しないことリスト</h3>
        <h4>現在進行中</h4>
        <ul>
          <Settings v-for="[id, data] in notToDoList" :key="id" :list="data.list" :id="id" :date="data.date" :selectListArray="selectListArray" @editList="onEditList" />
        </ul>
        <h4>終了済み</h4>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use 'sass:math';
@function rem($px) {
  @return math.div($px, 16px) * 1rem;
}

body {
  font-size: 1rem;
}
.header, .main {
  width: 80%;
  max-width: 600px;
  text-align: center;
  margin: 0 auto;
  padding: 0 auto;
  section {
    text-align: left;
  }
}
.header {
  position: relative;
  height: 20px;
  &__openBtn {
    z-index: 11;
    position: absolute;
    top: 10px;
    right: -10px;
    &.active {
      color: #fff;
    }
  }
  &__nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    transition: all 0.2s;
    &.active {
      opacity: 1;
      z-index: 10;
    }
    ul {
      display: none;
      position: absolute;
      z-index: 11;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      display: block;
      font-size: 200%;
      line-height: 3;
      color: #fff;
      text-align: center;
    }
    li {
      cursor: pointer;
    }
  }
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
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  z-index: 10;
  color: #fff;
}
</style>