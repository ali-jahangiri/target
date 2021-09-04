import firebase from "firebase";

import { references } from "../firebase"

const makeValidSnapshotData = snapshot => snapshot.docs.map(el => ({ id : el.id , ...el.data() }));

const requestWrapper = requestCallback => {
    return new Promise((resolve , reject) => {
        return requestCallback(resolve)
    })
}

const target = {
    getTargetList(){
        return requestWrapper(resolve => references.target.onSnapshot(snapshot => resolve(makeValidSnapshotData(snapshot))))
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
        console.log(targetId , habitName , "***");
        return requestWrapper(resolve => references.target.doc(targetId).update({
            habit : firebase.firestore.FieldValue.arrayRemove(habitName)
        }).then(resolve));
    },
    editTargetColor(targetId , newColor) {
        return requestWrapper(resolve => references.target.doc(targetId).update({
            color : newColor
        }).then(resolve))
    }
}

const requests =  {
    target,
}


export default requests; 