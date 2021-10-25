import { idGenerator } from ".";

class Note {
    constructor() {
        return {
            id : idGenerator(),
            title : "",
            thingList : [],
        }
    }
}

class Reminder {
    constructor(title , desc , time) {
        return {
            id : idGenerator(),
            title,
            desc,
            time,
        }
    }
}

class StreamItem {
    constructor(color , name) {
        return {
            color ,
            name,
            id : idGenerator(),
            hoursGoNext: 1,
            type : "plain"
        }
    }
}

class EmptyStreamItem {
    constructor() {
        return {
            name : null,
            id : idGenerator(),
            hoursGoNext: 1,
        }
    }
}

class StreamRoutine {
    constructor(hour) {
        return {
            name : null,
            id : idGenerator(),
            type : "routine",
            spendTime : -1,
            hoursGoNext : hour.to - hour.from,
        }
    }
}

class StreamTodo {
    constructor(todoTitle) {
        return {
            id : idGenerator(),
            name : todoTitle,
            color : "988989",
            type : "todo",
            hoursGoNext: 1,
        }
    }
}

export {
    StreamTodo,
    Note,
    Reminder,
    StreamItem,
    StreamRoutine,
    EmptyStreamItem,
}