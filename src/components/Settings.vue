<script setup lang="ts">
  import {ref, watch} from 'vue';

  const disabledClass = ref('disabled');
  const editBtnText: string[] = ['編集', '保存'];
  const editBtnTextIndex = ref(0);

  interface Props {
    id: number;
    list: string;
    date: string;
  }

  interface Emits {
    (event: 'editList', id:number, list:string): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const editListdata = ref(props.list);

  const onEditListBtnClick = (aInputValue:string): void => {
    emit('editList', props.id, props.list, aInputValue);
  };

  const onEditList = (event: Event): void => {
    editBtnTextIndex.value = (editBtnTextIndex.value===0) ? 1 : 0;
    const parentDivElm =  event.target.parentNode.previousSibling;
    parentDivElm.classList.toggle('disabled');
    let inputElm = parentDivElm.children[1];
    if(!editBtnTextIndex.value) {
      onEditListBtnClick(inputElm.value);
    }
  }
</script>

<template>
  <li :data-index="id">
    <div class="settings__listArea__list" :class="disabledClass">
      <select>
        <option>{{ date }}</option>
      </select>
      <input type="text" :value="list">
    </div>
    <div class="settings__listArea__btnWrap">
      <button @click="onEditList">{{ editBtnText[editBtnTextIndex] }}</button>
      <button>このToDoを終了</button>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.settings__listArea {
  li {
    padding: 10px 0;
    margin: 0 0 10px;
    border: 1px solid #ddd;
    list-style: none;
  }
  &__list {
    display: flex;
    &.disabled {
      select, input {
        pointer-events: none;
        border: none;
        color: #999;
      }
    }
    input {
      width: 100%;
      padding: 10px;
    }
  }
  &__btnWrap {
    text-align: center;
    button {
      margin: 0 5px;
    }
  }
}
</style>
