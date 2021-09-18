import { db } from "./firebase";

const stream = db.collection("stream");
const target = db.collection("target");
const habitPerWeek = db.collection("habitPerWeek");
const connection = db.collection("connection");

const references =  {
    stream,
    target,
    habitPerWeek,
    connection,
}


export default references