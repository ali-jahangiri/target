
import requests from './requests';
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { StreamItem, StreamRoutine, StreamTodo, Todo } from './modules';
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

export const selfClearInterval = (callback , timeout) => {
  let timer = setInterval(() => {
    callback();
  } , timeout)

  return function unsubscribe() {
    clearInterval(timer);
  }
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

export const getRandomItem = (array = []) => {
  return array[Math.floor(Math.random() * array.length)]
}

export const deepClone = data => JSON.parse(JSON.stringify(data));

export const addZeroToAboveTenNumber = number => {
  return +number < 10 ? `0${number}` : number
}


export const findFilledStreamWeekDay = (weekDayName = "" , streamList = []) => {
  return streamList.filter(el => el.schedule[weekDayName].length).map(el => ({ ...el, schedule : el.schedule[weekDayName] }))
}

export const calcAllHabitForDay = dayHabitList => {
  return dayHabitList.reduce((acc , res) => {
    return acc + res.schedule.length
 } , 0)
}


export const hourValueChecker = (value , des , toHr , from) => {
  if(des === "from" && value >= toHr) return value - 1;
  else if(des === 'to' && value <= from) return value + 1
  if (value > 24) return 24;
  else return value
}


export const currentDateName = (currentMonth , currentDay) => {
  const now = _date();
  const allMonthDay = now.clone().add(currentMonth - 1 , "M").daysInMonth();
  
  const month = now.clone().add(currentMonth - 1 , "M").format("MMMM");
  const day = _date(`${now.year()}/${now.month() + 1 + (currentMonth - 1)}/${currentDay + (allMonthDay === 31 ? 1 : 2)}`).format('dddd')

  
  return {
    month,
    day
  }
}


export const createNewStreamItem = (habitInStreamArray , todayHabitArray , insertIndex , draggableId) => {
  const clonedArray = [...habitInStreamArray];
  const haveSomeValidStreamItemInThisIndex = clonedArray[insertIndex].name;
  
  const { color , item } = todayHabitArray.find(el => el.item.find(el => el.id === draggableId));
  const name = item.find(el => el.id === draggableId).name; 
  const newStreamItemModel = new StreamItem(color, name)

  if (!haveSomeValidStreamItemInThisIndex) {
    clonedArray[insertIndex] = newStreamItemModel;
    return clonedArray;
  } else {
    clonedArray.splice(insertIndex, 0, newStreamItemModel);
    return clonedArray;
  }

}

export const createNewTodo = (streamListArray , insertIndex , todoTitle) => {
  const clone = [...streamListArray];
  const haveSomeValidStreamItemInThisIndex = clone[insertIndex].name;
  const newTodoModel = new StreamTodo(todoTitle);

  if (!haveSomeValidStreamItemInThisIndex) {
    clone[insertIndex] = newTodoModel;
    return clone;
  } else {
    clone.splice(insertIndex, 0, newTodoModel);
    return clone;
  }
}


export const createDateHabitList = (allHabitList , currentDate) => {
  return allHabitList.map(el => ({ color : el.color , item : el.schedule[currentDate] })).filter(el => el.item?.length)
}

export const injectRoutineToDateStream = (streamList = [] , routineModel) => {
  const clonedStreamList = [...streamList];
  routineModel.list?.map(routine => clonedStreamList[routine.hour.from] = new StreamRoutine(routine.hour));
  return clonedStreamList;
}

export const reorderStreamItem = (streamItem , destination , source) => {
  const streamItemListClone = [...streamItem];
  const [removed] = streamItemListClone.splice(source , 1);
  streamItemListClone.splice(destination, 0, removed);
  return streamItemListClone;
}

export {
  requests
}