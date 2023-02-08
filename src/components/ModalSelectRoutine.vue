<script setup lang="ts">
  import {ref, watch} from 'vue';

  interface Props {
    selectListArray: string[];
    youbi: string[];
  }

  interface Emits {
    (event: 'addNewList', routine:number, customize:number[]): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const isOther = ref(false);
  const checkYoubiIndex = ref([]);

  const selectRoutineIndex = ref(0);
  selectRoutineIndex.value = 1;

  const onAddNewList = () => {
    if(selectRoutineIndex.value===5) {
      emit('addNewList', selectRoutineIndex.value, checkYoubiIndex.value);
    }
    else {
      emit('addNewList', selectRoutineIndex.value, []);
    }
  };

  watch(selectRoutineIndex, 
    ():void => {
      if(selectRoutineIndex.value===5) {
        isOther.value = true;
      }
      else {
        isOther.value = false;
      }
    }
  );

</script>

<template>
  <ul>
    <li v-for="(data,index) in props.selectListArray" :key="data">
      <input :id="'radio' + index" type="radio" :value="index" v-model="selectRoutineIndex" />
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
    <label for="start">終了日:</label>
    <input type="date" id="start" name="trip-start" value="2023-02-10" min="2023-02-10" max="2023-03-10">
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
