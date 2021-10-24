import { firebaseAuth } from ".";
import { db } from "./firebase";

const stream = db.collection("stream");
const target = db.collection("target");
const habitPerWeek = db.collection("habitPerWeek");
const routine = db.collection("routine");


function references(userId = firebaseAuth.currentUser.uid) {
    return {
        stream : stream.doc(userId).collection(userId),
        target : target.doc(userId).collection(userId),
        habitPerWeek : habitPerWeek.doc(userId).collection(userId),
        routine : routine.doc(userId).collection(userId),
    }
}

export default references;