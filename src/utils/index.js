import PersianDate from "persian-date";

export const randomItemFromArr = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateColor = (color, fade) => {
  return `${color}${fade}0`;
};

export const idGenerator = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

const today = new PersianDate().day();
const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export const habitForTodayExtractor = (habits) => {
  const nameOfToday = weekDays[today - 1];
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