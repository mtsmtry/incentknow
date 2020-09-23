
const admin = require('firebase-admin');
const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://incentknow.firebaseio.com"
});

const db = admin.firestore();

async function main() {
    const res = db.collection("containers/hXfgVZ9Kbvs9/items")
       .where("data.K79H", "==", 4)
       // .where("data.8MR8", "==", "秋")
        .where("data.GdtF", "array-contains-any", [{"B1eE": "火曜日", "LXqm": 2}, {"B1eE": "水曜日", "LXqm": 2}])
        ;
    const snap = await res.get();
    console.log(snap.docs.map(x => x.data()));
}

main();