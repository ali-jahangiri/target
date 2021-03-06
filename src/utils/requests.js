import firebase from "firebase";
import { createDateHabitList, injectRoutineToDateStream, makeValidSnapshotData, requestWrapper, _date } from ".";
import { firebaseAuth, references as pureReference } from "../firebase";

import { Note } from "./modules";


const references = () => pureReference(firebaseAuth.currentUser.uid);

const target = {
    getTargetList(callback){
        references().target.onSnapshot(snapshot => callback(makeValidSnapshotData(snapshot)))
    },
    addNewHabitToTarget(targetId , habit) {
        return requestWrapper(resolve => references().target.doc(targetId).update({
            habit: firebase.firestore.FieldValue.arrayUnion(habit)
        }).then(resolve))
    },
    deleteTarget(targetId) {
        return requestWrapper(resolve => references().target.doc(targetId).delete().then(resolve));
    },
    deleteTargetHabit(targetId , habitName) {
        return requestWrapper(resolve => references().target.doc(targetId).update({
            habit : firebase.firestore.FieldValue.arrayRemove(habitName)
        }).then(resolve));
    },
    editTarget(targetId , newValues) {
        return requestWrapper(resolve => references().target.doc(targetId).update({...newValues}).then(resolve))
    }
}


const habitPerWeek = {
    getEntireSchedule(callback) {
        references().habitPerWeek.onSnapshot(snapshot => callback(makeValidSnapshotData(snapshot)))  
    },
    deleteEntireSchedule(targetId) {
        return requestWrapper(resolve => references().habitPerWeek.doc(targetId).delete().then(resolve))
    },
}


const stream = {
    getStreamDetails(streamId) {
        return requestWrapper(resolve => references().stream.doc(streamId).get().then(res => resolve(res.data()?.desc || "")))
    },
    initializer(date , callback = () => ({ streamItem : [] , todayHabit : [] })) {
        references().habitPerWeek
            .get()
            .then(({ docs }) => {
                let currentDateDayName = _date(date).format('dddd');
                const currentDateHabitList = createDateHabitList(docs.map(el => el.data()) , currentDateDayName);

                references().stream.doc(date).onSnapshot(snapShot => {
                    if(snapShot.exists) {
                        callback({ streamItem : snapShot.data().item , todayHabit : currentDateHabitList })
                    }else {
                        requests.routine.getRoutineList(currentDateDayName , response => {
                            const newDayStreamAfterRoutineInjection = injectRoutineToDateStream(response);
                            references().stream.doc(date).set({ item : newDayStreamAfterRoutineInjection })
                                .then(() => callback({ streamItem : newDayStreamAfterRoutineInjection , todayHabit : currentDateHabitList }))
                        })
                    }
                })
            })
    },
    sync(date , newHabitInStream) {
        references().stream.doc(date)
            .update({item : newHabitInStream})
    }
}

const commends = {
    reminder : {
        setReminder(streamId , newReminder) {
            return requestWrapper(resolve => references().stream.doc(streamId).update({ 
                reminder : firebase.firestore.FieldValue.arrayUnion(newReminder)
            }).then(resolve))
        },
        removeReminder(streamId , targetReminder) {
            requestWrapper(resolve => references().stream.doc(streamId).update({
                reminder : firebase.firestore.FieldValue.arrayRemove(targetReminder)
            }).then(resolve))
        },
        clearReminder(streamId) {
            requestWrapper(resolve => references().stream.doc(streamId).update({
                reminder : []
            }).then(resolve))
        },
        getReminderList(streamId , callback) {
            references().stream.doc(streamId).onSnapshot(snapshot => callback(snapshot.data().reminder))
        }
    },
    note : {
        syncNote(streamId , note) {
            return requestWrapper(resolve => references().stream.doc(streamId).update({
                note : note
            }).then(resolve))
        },
        initializeNote(streamId) {
            return requestWrapper(resolve => {
                references().stream.doc(streamId)
                .get()
                .then(response => {
                    if("note" in response.data()) resolve(response.data().note)
                    else {
                        const note = new Note();
                        references().stream.doc(streamId)
                            .update({ note }).then(_ => resolve(note))
                    }
                })
            })
        }
    },
}


const routine = {
    initializeRoutineName(dayName) {
        return requestWrapper(resolve => references().routine.doc(dayName).set({ list : [] }).then(resolve))
    },
    getRoutineList(dayName , callback) {
        references().routine.doc(dayName).onSnapshot(snapshot => callback({ ...snapshot.data() , id : snapshot.id }))
    },
    setNewRoutine(dayName , routine) {
        return requestWrapper(resolve => references().routine.doc(dayName).update({
            list : firebase.firestore.FieldValue.arrayUnion(routine)
        }).then(resolve))
    },
    removeRoutine(dayName , routineId) {
        return requestWrapper(resolve => references().routine.doc(dayName).update({
            list : firebase.firestore.FieldValue.arrayRemove(routineId)
        }).then(resolve))
    },
    syncRoutine(dayName , newRoutineModel) {
        requestWrapper(resolve => references().routine.doc(dayName).update({
            list : newRoutineModel
        }).then(resolve))
    }
}


const recovery = {
    entire() {
        return requestWrapper(resolve => {
            const reqNames = ["habitPerWeek" , "routine" , "target" , "stream"];
            
            const allReqList = Promise.all([references().habitPerWeek.get() , references().routine.get() , references().target.get() , references().stream.get()])
            allReqList.then(data => {
                const result = data.map((el , index) => ({
                    req : reqNames[index],
                    value : el.docs.map(el => el.data())
                }));
                resolve(result);
            })
        })
    }
}

const requests =  {
    target,
    habitPerWeek,
    stream,
    commends,
    routine,
    recovery,
}


export default requests; 