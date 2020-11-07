
const admin = require('firebase-admin');
const serviceAccount = require("./service-account-file.json");
const realm = require("realm");



const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const url = "mongodb+srv://admin:21280712@cluster0.0df0y.gcp.mongodb.net/main?retryWrites=true&w=majority";
const time3 = Date.now();

MongoClient.connect(url, async (err, client) => {
    /* Errorがあれば処理を中断 */

    /* 接続に成功すればコンソールに表示 */
    console.log('Connected successfully to server');
  
    /** DBを取得 */
    const db = client.db("main");

    const time = Date.now();
    const res = await db.collection("test").findOne({name: "ryoi"});
    const time2 = Date.now();
    console.log("finish");
    console.log(res);
    console.log(time2 - time);
    console.log(time2 - time3);
  
    /* DBとの接続切断 */
    client.close();
  });




const app = new realm.App("application-0-iztgu");



async function run() {
    // Create a Credentials object to identify the user.
    // Anonymous credentials don't have any identifying information, but other
    // authentication providers accept additional data, like a user's email and
    // password.
    const credentials = Realm.Credentials.anonymous();
    // You can log in with any set of credentials using `app.logIn()`
    const user = await app.logIn(credentials);
    console.log(`Logged in with the user id: ${user.id}`);
    console.log(user.functions);
    const time = Date.now();
    const res = await user.functions.function0();
    const time2 = Date.now();
    console.log(res);
    console.log(time2 - time);

};
run().catch(err => {
    console.error("Failed to log in:", err)
});

function firebase(){
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
}