import firebase from "firebase";

import { references } from "../firebase"

const makeValidSnapshotData = snapshot => snapshot.docs.map(el => ({ id : el.id , ...el.data() }));

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
    deleteEntireSchedule(targetId) {
        return requestWrapper(resolve => references.habitPerWeek.doc(targetId).delete().then(resolve))
    },
}


const stream = {
    deleteStream(streamId) {
        requestWrapper(resolve => references.stream.doc(streamId).delete().then(resolve))
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
        }
    },
    note : {
        setNote(streamId , newNote) {
            return requestWrapper(resolve => references.stream.doc(streamId).update({
                note : newNote
            }).then(resolve))
        },
        removeNote(streamId , targetNote) {
            return requestWrapper(resolve => references.stream.doc(streamId).update({
                note : []
            }).then(resolve))
        },
        clearNote(streamId) {
            return requestWrapper(resolve => references.stream.doc(streamId).update({
                note : []
            }).then(resolve))
        }
    },
    event : {

    },
}

const requests =  {
    target,
    habitPerWeek,
    stream,
    connectionObserver,
    commends,
}


export default requests; 