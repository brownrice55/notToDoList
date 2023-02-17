const holidayArray = [
  { month:1, day:1 },
  { month:2, day:11 },
  { month:2, day:23 },
  { month:4, day:29 },
  { month:5, day:3 },
  { month:5, day:4 },
  { month:5, day:5 },
  { month:8, day:11 },
  { month:11, day:3 },
  { month:11, day:23 },
];

const holidayArray2 = [
  { month:1, youbi:1, times:2 },//成人の日
  { month:7, youbi:1, times:3 },//海の日
  { month:9, youbi:1, times:3 },//敬老の日
  { month:10, youbi:1, times:2 },//スポーツの日
];

const getWeekNumAndIsHoliday = (aMonth:number, aDay:number, aYoubi:number) => {
  for(let cnt=0,len=holidayArray2.length;cnt<len;++cnt) {
    if(holidayArray2[cnt].month===aMonth && holidayArray2[cnt].youbi===aYoubi) {
      if(holidayArray2[cnt].times===Math.floor(aDay/7)) {
        return true;
      }
    }
  }
  return false;
};

const getIsHoliday = (aYear:number, aMonth:number, aDay:number, aYoubi:number) => {
  if(aMonth===3 || aMonth===9) {
    if(aMonth===3) {//春分の日
      let result = (Math.floor(20.8431+0.242194*(aYear-1980)-Math.floor((aYear-1980)/4))===aDay) ? true : false;
      return result;
    }
    if(aMonth===9) {//秋分の日
      let result = (Math.floor(23.2488+0.242194*(aYear-1980)-Math.floor((aYear-1980)/4))===aDay) ? true : false;
      return result;
    }
  }
  else {
    for(let cnt=0,len=holidayArray.length;cnt<len;++cnt) {
      if(aMonth==holidayArray[cnt].month && aDay==holidayArray[cnt].day) {
        return true;
      }
    }
  }
  if(aYoubi===1 && (aMonth===1 || aMonth===7 || aMonth===9 || aMonth===10)) {
    if(getWeekNumAndIsHoliday(aMonth, aDay, aYoubi)) {
      return true;
    }
  }
  return false;
};

export {
  getIsHoliday
};