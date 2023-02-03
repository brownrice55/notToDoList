<script setup lang="ts">
  import {ref} from 'vue';
  
  const selectList = ref('毎日');
  const inputList = ref('');
  const listDataArray = ref([]);

  const onAddList = () : void => {
    let listData = [selectList.value,inputList.value];
    listDataArray.value.push(listData);
    localStorage.setItem('notToDoList', JSON.stringify(listDataArray.value));
    inputList.value = '';
    selectList.value = '毎日';
  };
</script>

<template>
  <h2>設定</h2>
  <p>あなたは何をしないですか？</p>

  <div class="settings__inputArea">
    <select name="" id="" v-model="selectList">
      <option>毎日</option>
      <option>平日</option>
      <option>土日</option>
      <option>週に1日</option>
    </select>
    <input type="text" v-model="inputList">
    <p>例）平日　21時以降はブルーライトを浴びない</p>
  </div>
  <div class="settings__btnArea">
    <button @click="onAddList">追加する</button>
  </div>
  <div class="settings__listArea" v-if="listDataArray.length">
    <ul>
      <li v-for="data in listDataArray" :key="data">
        <p>
          <span>{{ data[1] }}</span>
          <span>{{ data[0] }}</span>
        </p>
        <button>編集</button>
        <button>このToDoを終了</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.settings__listArea li {
  padding: 10px 0;
}
.settings__listArea li span {
  display: block;
}
</style>
