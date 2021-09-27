import { idGenerator } from ".";

class Todo {
    constructor(todo) {
        return {
            id : idGenerator(),
            name : todo,
            color : "988989",
            hoursGoNext: 1,
        }
    }
}


class Note {
    constructor() {
        return {
            id : idGenerator(),
            title : "",
            thingList : [],
        }
    }
}

export {
    Todo,
    Note,
}