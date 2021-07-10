import PersianDate from "persian-date";

export const randomItemFromArr = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}


export const generateColor = (color , fade) => {
    return `${color}${fade}0`
}

export const idGenerator = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}


const today = new PersianDate().day()
const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
]

export const habitForTodayExtractor = habits => {
    const nameOfToday = weekDays[today - 1];
    return habits
            .filter(el => el.data.habit.filter(singleHabit => singleHabit.day === nameOfToday).length)
            .map(el => ({
                id : el.id,
                habitsForToday : el.data.habit.filter(el => el.day === nameOfToday).map(el => el.habit).flat(1),
                color : el.data.color
            }))
}
