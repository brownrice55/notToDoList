const getShowRoutine = (aRoutine:number, aCustomize:number[], aSelectListArray:string[], aYoubi:string[]) => {
  let showRoutineData:string = '';
  let showCustomizeYoubi:string = '';
  if(aRoutine===5) {
    for(let cnt=0,len=aCustomize.length;cnt<len;++cnt) {
      showCustomizeYoubi += aYoubi[aCustomize[cnt]] + '曜日';
      if(cnt<len-1) {
        showCustomizeYoubi += '、';
      }
      showRoutineData = showCustomizeYoubi;
    }
  }
  else {
    showRoutineData = aSelectListArray[aRoutine];
  }
  return showRoutineData;
};

export {
  getShowRoutine
};