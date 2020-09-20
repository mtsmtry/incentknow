
const admin = require('firebase-admin');
const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://incentknow.firebaseio.com"
});

const db = admin.firestore();

async function main() {
    const res = db.collection("containers/ec11LNyn6cJt/items").where("indexes.SYBZ.KZe4:89l6", "array-contains", "松本B");
    const snap = await res.get();
    console.log(snap.docs.map(x => x.data()));
}

main();