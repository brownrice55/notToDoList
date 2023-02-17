<script setup lang="ts">
  import {ref} from 'vue';
  import {getIsHoliday} from './modules/getHoliday';
  import {getShowRoutine} from './modules/getShowRoutine';

  interface Props {
    weeklyNotTodoList: any;
    ListSize: number;
    todaysDate: any;
    past7Days: any;
    isHoliday: boolean;
    selectListArray: string[];
    youbi: string[];
  }

  const props = defineProps<Props>();

  interface weeklyNotTodoListType {
    id: number;
    data: object;
  }

  let totalTitle = Array(props.ListSize).fill('');
  let totalData = Array(props.ListSize).fill(0);
  let routineData = Array(props.ListSize).fill([]);
  const getTotalArray = () => {
    props.weeklyNotTodoList.forEach((val:any, key:number) => {
      let data = val.data;
      for(let cnt=0,len=data.length;cnt<len;++cnt) {
        let index = data[cnt][1].id;
        if(data[cnt][1].done) {
          totalData[index]++;
          totalTitle[index] = data[cnt][1].list;
          routineData[index] = [data[cnt][1].routine, data[cnt][1].customize];
        }
      }
      return totalData;
    });
  };
  getTotalArray();

  // 今日と過去7日の間に祝日が何日あるかを取得
  let isHolidayCnt:number = 0;
  let isHolidaySunSatCnt:number = 0;
  if(props.isHoliday) {//今日が祝日かどうか
    isHolidayCnt++;
    if(props.todaysDate.youbi==0 || props.todaysDate.youbi==6) {
      isHolidaySunSatCnt++;
    }
  }
  for(let cnt=0;cnt<7;++cnt) {//過去7日の間
    let isHoliday = getIsHoliday(props.past7Days[cnt].year, props.past7Days[cnt].month, props.past7Days[cnt].day, props.past7Days[cnt].youbi);
    if(isHoliday) {
      isHolidayCnt++;
      if(props.past7Days[cnt].youbi==0 || props.past7Days[cnt].youbi==6) {
        isHolidaySunSatCnt++;
      }  
    }
  }

  const getAllDate = (aRoutineData:any) => {
    if(aRoutineData.length) {
      let result = 0;
      if(aRoutineData[0]==0) {//毎日
        return 8;
      }
      if(aRoutineData[0]===1 || aRoutineData[0]===2) {
        result = (props.todaysDate.youbi===0 || props.todaysDate.youbi===6) ? 5 : 6;
        if(aRoutineData[0]===1) {//平日（祝日含まない）の時
          return (result-(isHolidayCnt-isHolidaySunSatCnt));//平日の時なので、祝日が土日の場合はカウントしない
        }
        //平日（祝日含む）の時
        return result;
      }
      if(aRoutineData[0]===3 || aRoutineData[0]===4) {
        result = (props.todaysDate.youbi===0 || props.todaysDate.youbi===6) ? 3 : 2;
        if(aRoutineData[0]===3) {//土日の時
          return result;
        }
        //土日祝の時
         return (result+(isHolidayCnt-isHolidaySunSatCnt));//祝日が土日の場合はダブってしまうのでカウントしない
      }
      if(aRoutineData[0]===5) {//その他の時
        let isHolidayInCustomize = aRoutineData[1].some(val=>val===7) ? true : false;
        if(isHolidayInCustomize && isHolidayCnt) {//祝日含む時
          return aRoutineData[1].length-1 + isHolidayCnt;
        }
        return aRoutineData[1].length;
      }
    }
    return 1000000;
  }

  const getPer = (aDone:number, aAll:number) => {
    return Math.floor(aDone/aAll)*100;
  };

  let allPerDate = Array(props.ListSize).fill(0);

  for(let cnt=0,len=allPerDate.length;cnt<len;++cnt) {
    let allData = getAllDate(routineData[cnt]);
    if(allData!==1000000) {
      allPerDate[cnt] = Math.floor(totalData[cnt]/allData*100);
    }
  }
</script>

<template>
  <dl class="total__list">
    <template v-for="(data,index) in totalData" :key="data">
      <template v-if="data">
        <dt>
          {{ totalTitle[index] }}<br>
          {{ getShowRoutine(routineData[index][0], routineData[index][1], props.selectListArray, props.youbi) }}
        </dt>
        <dd>
          しなかった率：{{ allPerDate[index] }}%
          （期間：{{ getAllDate(routineData[index]) }}日間）
        </dd>
      </template>
    </template>
  </dl>
</template>

<style lang="scss" scoped>
.total__list{
  dt {
    font-weight: normal;
    padding: 10px 10px 0;
  }
  dd {
    padding: 0 10px 10px;
  }
}
</style>
