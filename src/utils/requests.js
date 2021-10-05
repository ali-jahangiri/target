import firebase from "firebase";

import { references } from "../firebase"
import { Note } from "./modules";

const makeValidSnapshotData = snapshot => snapshot.docs?.map(el => ({ id : el.id , ...el.data() }));

const requestWrapper = requestCallback => {
    return new Promise((resolve , reject) => {
        return requestCallback(resolve)
    })
}

const target = {
    getTargetList(callback){
        references.target.onSnapshot(snapshot => callback(makeValidSnapshotData(snapshot)))
    },
    addNewHabitToTarget(targetId , habit) {
        return requestWrapper(resolve => references.target.doc(targetId).update({
            habit: firebase.firestore.FieldValue.arrayUnion(habit)
        }).then(resolve))
    },
    deleteTarget(targetId) {
        return requestWrapper(resolve => references.target.doc(targetId).delete().then(resolve));
    },
    deleteTargetHabit(targetId , habitName) {
        return requestWrapper(resolve => references.target.doc(targetId).update({
            habit : firebase.firestore.FieldValue.arrayRemove(habitName)
        }).then(resolve));
    },
    editTarget(targetId , newValues) {
        return requestWrapper(resolve => references.target.doc(targetId).update({...newValues}).then(resolve))
    }
}


const habitPerWeek = {
    getEntireSchedule(callback) {
        // return requestWrapper(resolve => references.habitPerWeek.onSnapshot(snapshot => ))  
        references.habitPerWeek.onSnapshot(snapshot => callback(makeValidSnapshotData(snapshot)))  
    },
    deleteEntireSchedule(targetId) {
        return requestWrapper(resolve => references.habitPerWeek.doc(targetId).delete().then(resolve))
    },
}


const stream = {
    deleteStream(streamId) {
        requestWrapper(resolve => references.stream.doc(streamId).delete().then(resolve))
    },
    setStreamDetails(streamId , details) {
        return requestWrapper(resolve => references.stream.doc(streamId).update({
            desc : details
        }).then(resolve))
    },
    getStreamDetails(streamId) {
        return requestWrapper(resolve => references.stream.doc(streamId).get().then(res => resolve(res.data()?.desc || "")))
    }
}

const connectionObserver = {
    connect(callback) {
        references.connection.onSnapshot(snapshot => callback(makeValidSnapshotData(snapshot)))
    }
}


const commends = {
    reminder : {
        setReminder(streamId , newReminder) {
            return requestWrapper(resolve => references.stream.doc(streamId).update({ 
                reminder : firebase.firestore.FieldValue.arrayUnion(newReminder)
            }).then(resolve))
        },
        removeReminder(streamId , targetReminder) {
            requestWrapper(resolve => references.stream.doc(streamId).update({
                reminder : firebase.firestore.FieldValue.arrayRemove(targetReminder)
            }).then(resolve))
        },
        clearReminder(streamId) {
            requestWrapper(resolve => references.stream.doc(streamId).update({
                reminder : []
            }).then(resolve))
        },
        getReminderList(streamId , callback) {
            references.stream.doc(streamId).onSnapshot(snapshot => callback(snapshot.data().reminder))
        }
    },
    note : {
        syncNote(streamId , note) {
            return requestWrapper(resolve => references.stream.doc(streamId).update({
                note : note
            }).then(resolve))
        },
        initializeNote(streamId) {
            return requestWrapper(resolve => {
                references.stream.doc(streamId)
                .get()
                .then(response => {
                    if("note" in response.data()) resolve(response.data().note)
                    else {
                        const note = new Note();
                        references.stream.doc(streamId)
                            .update({ note }).then(_ => resolve(note))
                    }
                })
            })
        }
    },
}


const routine = {
    initializeRoutineName(dayName) {
        return requestWrapper(resolve => references.routine.doc(dayName).set({ list : [] }).then(resolve))
    },
    getRoutineList(dayName , callback) {
        references.routine.doc(dayName).onSnapshot(snapshot => callback({ ...snapshot.data() , id : snapshot.id }))
    },
    setNewRoutine(dayName , routine) {
        return requestWrapper(resolve => references.routine.doc(dayName).update({
            list : firebase.firestore.FieldValue.arrayUnion(routine)
        }).then(resolve))
    },
    removeRoutine(dayName , routineId) {
        return requestWrapper(resolve => references.routine.doc(dayName).update({
            list : firebase.firestore.FieldValue.arrayRemove(routineId)
        }).then(resolve))
    },
    syncRoutine(dayName , newRoutineModel) {
        requestWrapper(resolve => references.routine.doc(dayName).update({
            list : newRoutineModel
        }).then(resolve))
    }
}

const requests =  {
    target,
    habitPerWeek,
    stream,
    connectionObserver,
    commends,
    routine,
}


export default requests; 