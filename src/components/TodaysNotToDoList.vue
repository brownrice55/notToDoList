<script setup lang="ts">
  import {ref, onMounted} from 'vue';

  interface Props {
    id: number;
    list: string;
    routine: number;
    done: boolean;
    selectListArray: string[];
    customize: number[];
    youbi: string[];
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

  const showSelectListData = ref('');
  let showCustomizeYoubi:string = '';

  onMounted(
    (): void => {
      if(props.routine===5) {
        for(let cnt=0,len=props.customize.length;cnt<len;++cnt) {
          showCustomizeYoubi += props.youbi[props.customize[cnt]] + '曜日';
          if(cnt<len-1) {
            showCustomizeYoubi += '、';
          }
          showSelectListData.value = showCustomizeYoubi;
        }
      }
      else {
        showSelectListData.value = props.selectListArray[props.routine];
      }
    }
  );

</script>

<template>
  <li>
    <input type="checkbox" :id="'check' + props.id" :checked="localDone" @change="checkDoneTodo">
    <label :for="'check' + props.id" :class="localDone?'done':''">{{ list }}<span>{{ showSelectListData }}</span></label>
  </li>
</template>

<style lang="scss" scoped>
.todaysList {
  &__list {
    @include inputCheckList;
  }
}

</style>
