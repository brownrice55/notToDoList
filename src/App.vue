<script setup lang="ts">
import TodaysNotTodoList from './components/TodaysNotTodoList.vue'
import WeeklyNotTodoList from './components/WeeklyNotTodoList.vue'
import Total from './components/Total.vue'
import Settings from './components/Settings.vue'
import {getIsHoliday} from './components/modules/getHoliday'

import {ref, onMounted} from 'vue';

const activeClass = ref('');
const activeClassCnt = ref(0);
const showPageKey = ref('');
const isNotTodoData = ref(true);

const youbi:string[] = ['日','月','火','水','木','金','土','祝'];
const today = new Date();
const todaysDate = { year:today.getFullYear(), month:(today.getMonth()+1), day:today.getDate(), youbi:today.getDay() };
const todayMs = new Date(todaysDate.year + '/' + todaysDate.month + '/' + todaysDate.day).getTime();

let notTodoList = new Map<number, notTodoListType>();
const notTodoListJsonStr = localStorage.getItem('notTodoList');

if(notTodoListJsonStr!=='undefined') {
  const notTodoListJson = JSON.parse(notTodoListJsonStr);
  notTodoList = new Map<number, notTodoListType>(notTodoListJson);
}

interface notTodoListType {
  id: number;
  list: string;
  routine: number;
  stop: string;
  done: boolean;
  customize: number[];
  stopTodoDate: string;
}

let weeklyNotTodoList = new Map<number, weeklyNotTodoListType>();
const weeklyNotTodoListJsonStr = localStorage.getItem('weeklyNotTodoList');

if(weeklyNotTodoListJsonStr!=='undefined') {
  const weeklyNotTodoListJson = JSON.parse(weeklyNotTodoListJsonStr);
  weeklyNotTodoList = new Map<number, weeklyNotTodoListType>(weeklyNotTodoListJson);
}

interface weeklyNotTodoListType {
  id: number;
  data: any;
}

const totalData = JSON.parse(localStorage.getItem('totalNotTodoList'));

onMounted(
  (): void => {
    showPageKey.value = (notTodoListJsonStr) ? 'todaysList': 'settings';
    isNotTodoData.value = (notTodoListJsonStr) ? true: false;
    weeklyNotTodoList = getWeeklyNotTodoList();
    if(notTodoList.size) {
      //notToDolistの絞り込み　今日のリストのみtodaysNotTodoListに入れてweeklyにも入れる
      let todaysNotTodoList = getTodaysNotTodoList();
      weeklyNotTodoList.set(todayMs, {id:todayMs, data:[...todaysNotTodoList]});
      localStorage.setItem('weeklyNotTodoList', JSON.stringify([...weeklyNotTodoList]));
    }
  }
);

const getTodaysNotTodoList = () => {
  const newList = new Map<number, notTodoListType>();
    notTodoList.forEach((val:notTodoListType, key:number) => {
    let isToday = isTodaysList(val.routine, val.customize);
    if(isToday && (val.stop==='nolimit' || new Date(val.stopTodoDate).getTime()-todayMs>=0)) {
      newList.set(key, val);
    }
  });
  return newList;
};

const getWeeklyNotTodoList = () => {
  const newList = new Map<number, weeklyNotTodoListType>();
    weeklyNotTodoList.forEach((val:weeklyNotTodoListType, key:number) => {
      if(val.id<=todayMs && val.id>=past7DaysMs[6]) {
        newList.set(key, val);
      }
  });
  return newList;
};

const onOpenMenu = (): void => {
  activeClass.value = (activeClassCnt.value%2===0) ? 'active' : '';
  activeClassCnt.value++;
};

const showPage = (aPage: string): void => {
  activeClass.value = (activeClassCnt.value%2===0) ? 'active' : '';
  activeClassCnt.value++;
  showPageKey.value = aPage;
};

// TodaysNotTodoList

const onCheckDoneList = (id:number, done:boolean) : void => {
  const editData = notTodoList.get(id);
  if(editData) {
    notTodoList.set(id, {id:id, list:editData.list, routine:editData.routine, customize:editData.customize, stop:editData.stop, stopTodoDate:editData.stopTodoDate, done:done});
    let todaysNotTodoList = getTodaysNotTodoList();
    weeklyNotTodoList.set(todayMs, {id:todayMs, data:[...todaysNotTodoList]});
  }
  localStorage.setItem('notTodoList', JSON.stringify([...notTodoList]));
  localStorage.setItem('weeklyNotTodoList', JSON.stringify([...weeklyNotTodoList]));
}

// WeeklyNotTodoList
const past7DaysSetDate:any[] = Array(7).fill(Array(4).fill(0));
const past7Days:any[] = Array(7).fill(Array(4).fill(''));
const past7DaysMs:any[] = Array(7).fill(Array(4).fill(0));
for(let cnt=0;cnt<7;++cnt) {
  past7DaysSetDate[cnt] = new Date();
  past7DaysSetDate[cnt].setDate(past7DaysSetDate[cnt].getDate()-cnt-1); 
  past7Days[cnt] = {year:past7DaysSetDate[cnt].getFullYear(), month:(past7DaysSetDate[cnt].getMonth()+1), day:past7DaysSetDate[cnt].getDate(), youbi:past7DaysSetDate[cnt].getDay()};
  past7DaysMs[cnt] = todayMs-(86400000*(cnt+1));
}

// Settings
const selectListIndex = ref(0);
const selectListArray: string[] = ['毎日', '平日だけ（祝日含まない）', '平日だけ（祝日含む）', '土日だけ', '土日祝だけ', 'その他'];

const onEditList = (aId:number, aEditedList:string) : void => {
  const editData = notTodoList.get(aId);
  if(editData===undefined) { return; }
  if(aEditedList!=='undefined') {
    notTodoList.set(aId, {id:aId, list:aEditedList, routine:editData.routine, customize:editData.customize, stop:editData.stop, stopTodoDate:editData.stopTodoDate, done:editData.done});
    let todaysNotTodoList = getTodaysNotTodoList();
    weeklyNotTodoList.set(todayMs, {id:todayMs, data:[...todaysNotTodoList]});
  }
  localStorage.setItem('notTodoList', JSON.stringify([...notTodoList]));
  localStorage.setItem('weeklyNotTodoList', JSON.stringify([...weeklyNotTodoList]));
};

let isHoliday = getIsHoliday(todaysDate.year, todaysDate.month, todaysDate.day, todaysDate.youbi);

if(!isHoliday && todaysDate.youbi===1) {
  // 今日が月曜日で祝日で無い場合でも、前日の日曜日が祝日の時は振替休日になる
  let isYesterdayHoliday = getIsHoliday(past7Days[0].year, past7Days[0].month, past7Days[0].day, past7Days[0].youbi);
  if(isYesterdayHoliday) {
    isHoliday = true;
  }
}

const isTodaysList = (aRoutine:number, aCustomize:number[]) => {
  if(aRoutine==0) {//毎日の時
    return true;
  }
  if(aRoutine==1 && todaysDate.youbi!==0 && todaysDate.youbi!==6 && !isHoliday) {//平日（祝日含まない）の時
    return true;
  }
  if(aRoutine==2 && todaysDate.youbi!==0 && todaysDate.youbi!==6) {//平日（祝日含む）の時
    return true;
  }
  if(aRoutine==3 && (todaysDate.youbi===0 || todaysDate.youbi===6)) {//土日の時
    return true;
  }
  if(aRoutine==4 && (todaysDate.youbi===0 || todaysDate.youbi===6 || isHoliday)) {//土日祝の時
    return true;
  }
  if(aRoutine==5) {//その他の時
    const isToday = (aCustomize.some(val => val===todaysDate.youbi)) ? true : false;
    if(isToday) {
      return true;
    }
    const isHolidayInCustomizeArray = aCustomize.some(val=>val===7) ? true : false;
    if(isHolidayInCustomizeArray && isHoliday) {//祝日の時
      return true;
    }
  }
  return false;
};

const onAddNewList = (aId:number, routine:number, customize:number[], list:string, stopTodo:string, stopTodoDate:string) => {
  const notTodoListArray = [...notTodoList];
  let id = (aId===100000) ? notTodoListArray.length : aId;
  notTodoList.set(id, {id:id, list:list, routine:routine, customize:customize, stop:stopTodo, stopTodoDate:stopTodoDate, done:false});
  let todaysNotTodoList = getTodaysNotTodoList();
  weeklyNotTodoList.set(todayMs, {id:todayMs, data:[...todaysNotTodoList]});
  localStorage.setItem('notTodoList', JSON.stringify([...notTodoList]));
  localStorage.setItem('weeklyNotTodoList', JSON.stringify([...weeklyNotTodoList]));
  selectListIndex.value = 0;
  if(!isNotTodoData.value) {
    isNotTodoData.value = true;
  }
};

</script>

<template>
  <header class="header" v-if="isNotTodoData">
    <button class="header__openBtn" @click="onOpenMenu" :class="activeClass">menu</button>
    <nav class="header__nav" :class="activeClass">
      <ul>
        <li @click="showPage('todaysList')" v-if="notTodoList">今日のリスト</li>
        <li @click="showPage('weeklyList')" v-if="weeklyNotTodoList.size>1">今週のリスト</li>
        <li @click="showPage('total')" v-if="totalData">集計結果</li>
        <li @click="showPage('settings')">設定</li>
      </ul>
    </nav>
  </header>

  <main class="main">
    <section v-if="showPageKey==='todaysList'" class="todaysList">
      <h2 class="todaysList__title">{{ todaysDate.year }}年{{ todaysDate.month }}月{{ todaysDate.day }}日（{{ youbi[todaysDate.youbi] }}）のしないことリスト</h2>
      <ul class="todaysList__list">
        <template v-for="[id, data] in notTodoList" :key="id">
          <TodaysNotTodoList v-if="isTodaysList(data.routine, data.customize) && (data.stop==='nolimit' || data.stopTodoDate && new Date(data.stopTodoDate).getTime()-todayMs>=0)" :list="data.list" :id="id" :routine="data.routine" :customize="data.customize" :done="data.done" :selectListArray="selectListArray" :youbi="youbi" @checkDoneList="onCheckDoneList" />
        </template>
      </ul>
    </section>
    <section v-if="showPageKey==='weeklyList'" class="weeklyList">
      <WeeklyNotTodoList :weeklyNotTodoList="weeklyNotTodoList" :past7Days="past7Days" :youbi="youbi" :past7DaysMs="past7DaysMs" :todayMs="todayMs" />
    </section>
    <section v-if="showPageKey==='total'" class="total">
      <Total />
    </section>
    <section v-if="showPageKey==='settings'" class="settings">
      <Settings :notTodoList="notTodoList" :selectListArray="selectListArray" :youbi="youbi" :isNotTodoData="isNotTodoData" :todaysDate="todaysDate" :todayMs="todayMs" @addNewList="onAddNewList" @editList="onEditList" />
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