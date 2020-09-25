
const admin = require('firebase-admin');
const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://incentknow.firebaseio.com"
});

const db = admin.firestore();

async function main() {
    const res2 = db.collection("containers/hXfgVZ9Kbvs9/items")
       .where("data.K79H", "==", 4)
        .where("data.8MR8", "==", "秋")
        .where("data.GdtF", "array-contains-any", [{"B1eE": "火曜日", "LXqm": 2}, {"B1eE": "水曜日", "LXqm": 2}])
        ;
    const res = db.collection("containers/hXfgVZ9Kbvs9/items").doc("07Uzdv5HtxJh");
    const time = Date.now();
    const snap = await res.get();
    const time2 = Date.now();
    //console.log(snap.docs.map(x => x.data()));
    console.log(time2 - time);
}

main();