export const randomItemFromArr = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}


export const generateColor = (color , fade) => {
    return `${color}${fade}0`
}

export const idGenerator = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}