
import requests from './requests';
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { StreamItem, StreamRoutine, StreamTodo } from './modules';

dayjs.extend(jalaliday)

export const generateColor = (color, fade) => {
  return `${color}${fade}0`;
};

export const idGenerator = () => {
  return Math.random().toString(36).substr(2, 9);
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

export const _date = (targetDate) => dayjs(targetDate).calendar("jalali").locale('fa')

export const colors = ['345B63' , "D4ECDD" , "C36839" , "5F7A61" , "3E2C41" , "C3BA85" , "FFB740" , "C2B8A3" , "402218" , "D44000" , "536162" , "AC0D0D" , "7868E6", "BFB051" , "F3F4ED"]

export const getRandomItem = (array = []) => {
  return array[Math.floor(Math.random() * array.length)]
}

export const deepClone = data => JSON.parse(JSON.stringify(data));

export const addZeroToAboveTenNumber = number => {
  return +number < 10 ? `0${number}` : number;
}


export const findFilledStreamWeekDay = (weekDayName = "" , streamList = []) => {
  return streamList.filter(el => el.schedule[weekDayName].length).map(el => ({ ...el, schedule : el.schedule[weekDayName] }))
}

export const calcAllHabitForDay = dayHabitList => {
  return dayHabitList.reduce((acc , res) => {
    return acc + res.schedule.length
 } , 0)
}

export const makeValidSnapshotData = snapshot => snapshot.docs?.map(el => ({ id : el.id , ...el.data() }));
export const requestWrapper = requestCallback => new Promise(resolve => requestCallback(resolve))


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

export const injectRoutineToDateStream = (routineModel = []) => {
  return routineModel?.list ? routineModel.list.map(routine => ({
    layout : {
      y : routine.hour.from,
      x : 0,
      w : 1,
      h : routine.hour.to - routine.hour.from,
      static : true,
      i : routine.id
    },
    details : {
      i: routine.id,
      type : "routine",
      ...routine
    }
  })) : [];
}

export const reorderStreamItem = (streamItem , destination , source) => {
  const streamItemListClone = [...streamItem];
  const [removed] = streamItemListClone.splice(source , 1);
  streamItemListClone.splice(destination, 0, removed);
  return streamItemListClone;
}

export const fillInputValueWithCommend = (targetCommend = "" , currentFilledValue = "" , setInputValue , afterCompleteFill) => {
  const leftCharacter = targetCommend.split("").filter((_ , i) => i + 1 >= currentFilledValue.length);

  let currentIndex = 0;
  let newValue = currentFilledValue;
  
  let timer = setInterval(() => {
      newValue += leftCharacter[currentIndex];
      setInputValue(newValue);
      ++currentIndex;
      if(!leftCharacter[currentIndex]) {
          afterCompleteFill(newValue);
          clearInterval(timer);
      }
  } , 30)
}

export const percentTextValueHandler = percent => {
  if(percent <= 20) return "Already started";
  else if(percent <= 37) return "Cross the initial section";
  else if(percent <= 50) return "Reach the half";
  else if(percent <= 75) return "Pass the half";
  else if(percent <= 87) return "Cross the final section";
  else if(percent <= 95) return "Almost Done";
  else return "Completed"
}

export {
  requests
}