
import requests from './requests';
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday)

export const generateColor = (color, fade) => {
  return `${color}${fade}0`;
};

export const idGenerator = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const habitForTodayExtractor = (habits) => {
  // TODO change static name of day
  return habits
    .reduce((acc, res) => {
      return [
        ...acc,
        ...res.habit
          .filter((el) => el.day === "شنبه")
          .map((habit) =>
            habit.habit.map((el) => ({
              name: el.name,
              color: res.color,
              id: el.id,
            }))
          ),
      ];
    }, [])
    .flat();
};

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}



export const selfClearTimeout = (callback , timeout) => {
  let timer = setTimeout(() => {
    callback();
    clearTimeout(timer);
  } , timeout)
}


export const fetchLooper = snapshot => 
  snapshot.docs.map((el) => ({ ...el.data() }))

let 
persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
export const fixNumbers = function (str) {
  if(typeof str === 'string')  {
    for(var i=0; i<10; i++)    {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }
  return str;
};


export const _date = (targetDate) => dayjs(targetDate).calendar("jalali").locale('fa')

export const colors = ['345B63' , "D4ECDD" , "C36839" , "5F7A61" , "3E2C41" , "C3BA85" , "FFB740" , "C2B8A3" , "402218" , "D44000" , "536162" , "AC0D0D" , "7868E6", "BFB051" , "F3F4ED"]

export {
  requests
}