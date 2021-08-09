import { db } from "./firebase";

const stream = db.collection("stream");
const target = db.collection("target");
const habitPerWeek = db.collection("habitPerWeek");


const references =  {
    stream,
    target,
    habitPerWeek
}


export default references