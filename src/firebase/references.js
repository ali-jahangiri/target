import db from "./firebase";

const stream = db.collection("stream");
const target = db.collection("target");

const references =  {
    stream,
    target
}


export default references