import { firebaseAuth } from ".";
import { db } from "./firebase";

const stream = db.collection("stream");
const target = db.collection("target");
const habitPerWeek = db.collection("habitPerWeek");
const connection = db.collection("connection");
const routine = db.collection("routine");

// const references =  {
//     stream,
//     target,
//     habitPerWeek,
//     connection,
//     routine,
// }

// db.collection("fuck").doc().set({ id: "sdsjdhysdgs" , name : "test" })
//     .then(data => {
//         console.log(data);
//     })

function references(userId = firebaseAuth.currentUser.uid) {
    return {
        stream : stream.doc(userId).collection(userId),
        target : target.doc(userId).collection(userId),
        habitPerWeek : habitPerWeek.doc(userId).collection(userId),
        connection : connection.doc(userId).collection(userId),
        routine : routine.doc(userId).collection(userId),
    }
}

export default references;