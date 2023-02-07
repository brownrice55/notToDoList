<script setup lang="ts">
  import {ref, watch, computed} from 'vue';

  const disabledClass = ref('disabled');
  const selectListArray: string[] = ['毎日', '平日', '土日', '週に１回'];

  interface Props {
    id: number;
    list: string;
    date: number;
    selectListArray: string[];
  }

  interface Emits {
    (event: 'editList', id:number, date:number, list:string): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const localList = ref(props.list);
  const localDate = ref(props.date);

  const onEditListBtnClick = (aDateValue:number, aListValue:string): void => {
    emit('editList', props.id, aDateValue, aListValue);
  };

  const onEditList = (event:Event): void => {
    const targetElm =  event.target as HTMLElement;
    const parentElm = targetElm.parentNode as HTMLDivElement;
    parentElm.classList.toggle('disabled');
    const focusElm = targetElm.previousSibling as HTMLElement;
    focusElm.focus();
  };

  const onSaveList = (aType:string): void => {
    const targetElm =  event.target as HTMLElement;
    const targetParentElm =  targetElm.parentNode as HTMLElement;
    
    if(aType==='date' && targetElm.value!==props.date) {      
      localDate.value = targetElm.value;
      onEditListBtnClick(localDate.value, '');
    }
    else if(aType==='list' && targetElm.value!==props.list) {
      localList.value = targetElm.value;
      onEditListBtnClick('', localList.value);
    }
    targetParentElm.classList.toggle('disabled');
  };


</script>

<template>
  <li :data-index="id">
    <div class="settings__listArea__list">
      <div :class="disabledClass">
        <select @blur="onSaveList('date')">
          <template v-for="(d, i) in props.selectListArray" :value="i" :key="d">
            <option v-if="i===localDate" :value="i" selected>{{ props.selectListArray[i] }}</option>
            <option v-else :value="i">{{ d }}</option>
          </template>
        </select>
        <i class="fas fa-edit" @click="onEditList"></i>
      </div>
      <div :class="disabledClass">
        <input type="text" :value="localList" @blur="onSaveList('list')">
        <i class="fas fa-edit" @click="onEditList"></i>
      </div>
    </div>
    <div class="settings__listArea__btnWrap">
      
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
    padding: 0 10px;
    div {
      position: relative;
      &:first-child {
        width: 100px;
      }
      &:last-child {
        width: 100%;
      }
    }
    .disabled {
      select, input {
        pointer-events: none;
        border: none;
        color: #999;
      }
      i {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    input {
      width:100%;
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
</style>
