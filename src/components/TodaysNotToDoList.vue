<script setup lang="ts">
  import {ref} from 'vue';

  interface Props {
    id: number;
    list: string;
    date: number;
    done: boolean;
    selectListArray: string[];
  }

  interface Emits {
    (event: 'checkDoneList', id:number, done:boolean): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const localDone = ref(props.done);

  const checkDoneTodo = (event:Event): void => {
    const inputElm = event.target as HTMLInputElement;
    const labelElm = inputElm.nextSibling as HTMLElement;
    labelElm.classList.toggle('done');
    // doneにデータを追加してローカルストレージに保管する
    localDone.value = !localDone.value;
    emit('checkDoneList', props.id, localDone.value);
  }; 
  
</script>

<template>
  <li>
    <input type="checkbox" :id="'check' + props.id" :checked="localDone" @change="checkDoneTodo">
    <label :for="'check' + props.id" :class="localDone?'done':''">{{ list }} {{ selectListArray[date] }}</label>
  </li>
</template>

<style lang="scss" scoped>
.todaysList {
  &__list {
    li {
      margin: 0 0 14px 14px;
    }
    input {
      position: absolute;
      height: 0;
      width: 0;
      overflow: hidden;
    }
    label {
      position: relative;
      padding: 0 0 0 20px;
      cursor: pointer;
      &.done {
        text-decoration: line-through;
      }
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        width: 16px;
        height: 16px;
        top: 1px;
        background: #ccc;
        transition: all ease-in 0.1s;
      }
      &:after {
        content: '';
        position: absolute;
        top: 9px;
        left: 5px;
        transform: rotate(-45deg) scaleX(0);
        transform-origin: left;
        width: 11px;
        height: 5px;
        border-left: 3px solid #fff;
        border-bottom: 2px solid #fff;
        transition: transform 0.1s ease-in;
      }
    }
    input:checked + label {
      &:before {
        background-color: #333;
        border-color: #333;
      }
      &:after {
        transform: rotate(-45deg) scaleX(1);
      }
    }
  }
}

</style>
