<script setup lang="ts">
import TodaysNotToDoList from './components/TodaysNotToDoList.vue'
import WeeklyNotToDoList from './components/WeeklyNotToDoList.vue'
import Total from './components/Total.vue'
import Settings from './components/Settings.vue'

import {ref, onMounted} from 'vue';

const activeClass = ref('');
const activeClassCnt = ref(0);
const showPageKey = ref('');
const isNotToDoData = ref(true);

let notToDoList = new Map<number, notToDoListType>();
const notToDoListJsonStr = localStorage.getItem('notToDoList');

if(notToDoListJsonStr!=='undefined') {
  const notToDoListJson = JSON.parse(notToDoListJsonStr);
  notToDoList = new Map<number, notToDoListType>(notToDoListJson);
}

interface notToDoListType {
  id: number;
  list: string;
  routine: number;
  stop: string;
  done: boolean;
  customize: number[];
  stopTodoDate: string;
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
    notToDoList.set(id, {id:id, list:editData.list, routine:editData.routine, customize:editData.customize, stop:editData.stop, stopTodoDate:editData.stopTodoDate, done:done});
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


const onEditList = (aId:number, aEditedList:string) : void => {
  const editData = notToDoList.get(aId);
  if(editData===undefined) { return; }
  if(aEditedList!=='undefined') {
    notToDoList.set(aId, {id:aId, list:aEditedList, routine:editData.routine, customize:editData.customize, stop:editData.stop, stopTodoDate:editData.stopTodoDate, done:false});
  }
  localStorage.setItem('notToDoList', JSON.stringify([...notToDoList]));
};

const isTodaysList = (aRoutine:number, aCustomize:number[]) => {
  if(aRoutine==0) {//毎日の時
    return true;
  }
  if(aRoutine==1 && todaysDate.youbi!==0 && todaysDate.youbi!==6) {//平日の時***後で変更（祝日含まないので）
    return true;
  }
  if(aRoutine==2 && todaysDate.youbi!==0 && todaysDate.youbi!==6) {//平日（祝日含む）の時
    return true;
  }
  if(aRoutine==3 && (todaysDate.youbi===0 || todaysDate.youbi===6)) {//土日の時
    return true;
  }
  if(aRoutine==5) {//その他の時
    const isToday = (aCustomize.some(val => val===todaysDate.youbi)) ? true : false;
    if(isToday) {
      return true;
    }
  }
  return false;
};

const onAddNewList = (aId:number, routine:number, customize:number[], list:string, stopTodo:string, stopTodoDate:string) => {
  const notToDoListArray = [...notToDoList];
  let id = (aId===100000) ? notToDoListArray.length : aId;
  notToDoList.set(id, {id:id, list:list, routine:routine, customize:customize, stop:stopTodo, stopTodoDate:stopTodoDate, done:false});
  localStorage.setItem('notToDoList', JSON.stringify([...notToDoList]));
  selectListIndex.value = 0;
  if(!isNotToDoData.value) {
    isNotToDoData.value = true;
  }
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
          <TodaysNotToDoList v-if="isTodaysList(data.routine, data.customize)" :list="data.list" :id="id" :routine="data.routine" :customize="data.customize" :done="data.done" :selectListArray="selectListArray" :youbi="youbi" @checkDoneList="onCheckDoneList" />
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
      <Settings :notToDoList="notToDoList" :selectListArray="selectListArray" :youbi="youbi" :isNotToDoData="isNotToDoData" :todaysDate="todaysDate" @addNewList="onAddNewList" @editList="onEditList" />
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

</style>