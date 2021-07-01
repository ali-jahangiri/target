export const randomItemFromArr = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}


export const generateColor = (color , fade) => {
    return `${color}${fade}0`
}