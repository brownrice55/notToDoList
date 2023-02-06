<script setup lang="ts">
import TodaysNotToDoList from './components/TodaysNotToDoList.vue'
import WeeklyNotToDoList from './components/WeeklyNotToDoList.vue'
import Total from './components/Total.vue'
import Settings from './components/Settings.vue'

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
  date: string;
  end: number;
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

const selectList = ref('毎日');
const inputList = ref('');
const listDataArray = ref([]);

const onAddNewList = () : void => {
  if(!inputList.value.length) {
    inputListAlert.value = 'しないことを入力してください。';
    return;
  }
  const notToDoListArray = [...notToDoList];
  notToDoList.set(notToDoListArray.length, {list:inputList.value, date:selectList.value, end:0});
  localStorage.setItem('notToDoList', JSON.stringify([...notToDoList]));
  inputList.value = '';
  selectList.value = '毎日';
  if(!isNotToDoData.value) {
    isNotToDoData.value = true;
  }
};

const onEditList = (id:number, list:string, aEditedList) : void => {
  const editData = notToDoList.get(id);
  notToDoList.set(id, {list:aEditedList, date:editData.date, end:0});
  localStorage.setItem('notToDoList', JSON.stringify([...notToDoList]));
};

watch(inputList, 
  ():void => {
    inputListAlert.value = (inputList.value.length>30) ? '30字以内で入力してください' : '';
  }
);

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

  <main>
    <template v-if="showPageKey==='todaysList'">
      <TodaysNotToDoList v-for="[id, data] in notToDoList" :key="id" :list="data.list" :id="id" :date ="data.date" />
    </template>
    <template v-if="showPageKey==='weeklyList'">
      <WeeklyNotToDoList />
    </template>
    <template v-if="showPageKey==='total'">
      <Total />
    </template>
    <template v-if="showPageKey==='settings'">
      <h2>設定</h2>
      <p>あなたは何を<b>しない</b>ですか？</p>
      <div class="settings___desc">
        {{ inputListAlert }}
      </div>
      <div class="settings__inputArea">
        <select name="" id="" v-model="selectList">
          <option>毎日</option>
          <option>平日</option>
          <option>土日</option>
          <option>週に1日</option>
        </select>
        <input type="text" v-model="inputList">
      </div>
      <div class="settings___desc">
        <p>例）平日　21時以降はブルーライトを浴びない</p>
      </div>
      <div class="settings__btnArea">
        <button @click="onAddNewList">追加する</button>
      </div>
      <div class="settings__listArea">
        <h3>設定済みのしないことリスト</h3>
        <ul>
          <Settings v-for="[id, data] in notToDoList" :key="id" :list="data.list" :id="id" :date="data.date" @editList="onEditList" />
        </ul>
      </div>
    </template>
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
.header__nav {
  position: fixed;
  z-index: -1;
  opacity: 0;
  width: 100%;
  height: 100vh;
  background: #999;
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
  }
  li {
    cursor: pointer;
  }
}

.settings {
  b {
    font-weight: bold;
  }
  &__inputArea {
    display: flex;
    input {
      width: 100%;
      padding: 10px;
    }
    select {
      padding: 10px;
    }
  }
  &___desc {
    padding: 10px 0;
    font-size: rem(12px);
  }
}

</style>