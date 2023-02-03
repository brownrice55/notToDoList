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

const notToDoListData = JSON.parse(localStorage.getItem('notToDoList'));
const weekyListData = JSON.parse(localStorage.getItem('weeklyNotToDoList'));
const totalData = JSON.parse(localStorage.getItem('totalNotToDoList'));

onMounted(
  (): void => {
    showPageKey.value = (notToDoListData) ? 'todaysList': 'settings';
    isNotToDoData.value = (notToDoListData) ? true: false;
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

</script>

<template>
  <header class="header" v-if="isNotToDoData">
    <button class="header__openBtn" @click="onOpenMenu" :class="activeClass">menu</button>
    <nav class="header__nav" :class="activeClass">
      <ul>
        <li @click="showPage('todaysList')" v-if="notToDoListData">今日のリスト</li>
        <li @click="showPage('weeklyList')" v-if="weekyListData">今週のリスト</li>
        <li @click="showPage('total')" v-if="totalData">集計結果</li>
        <li @click="showPage('settings')">設定</li>
      </ul>
    </nav>
  </header>

  <main>
    <section v-if="showPageKey==='todaysList'">
      <TodaysNotToDoList :notToDoListData="notToDoListData" />
    </section>
    <section v-if="showPageKey==='weeklyList'">
      <WeeklyNotToDoList />
    </section>
    <section v-if="showPageKey==='total'">
      <Total />
    </section>
    <section v-if="showPageKey==='settings'">
      <Settings />
    </section>
  </main>
</template>

<style scoped>
.header__nav {
  position: fixed;
  z-index: -1;
  opacity: 0;
  width: 100%;
  height: 100vh;
  background: #999;
  transition: all 0.2s;
}
.header__nav.active {
  opacity: 1;
  z-index: 10;
}

.header__nav ul {
  display: none;
  position: absolute;
  z-index: 11;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.header__nav.active ul {
  display: block;
}
.header__nav.active li {
  cursor: pointer;
}
</style>
