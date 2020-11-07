'use strict';

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = process.env.MONGODB_URI; // or Atlas connection string

let cachedDb = null;


function connectToDatabase (uri) {
  console.log('=> connect to database');

  if (cachedDb) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }

  return MongoClient.connect(uri)
    .then(db => {
      cachedDb = db;
      return cachedDb;
    });
}

function queryDatabase (db) {
  console.log('=> query database');
  let vl = null;

  const time = Date.now();
  for(let i=0;i<3;i++) {
    vl = db.db("main").collection('test').findOne({ name: "ryoi" })
      .then(x => { return { statusCode: 200, body: x.univ }; })
      .catch(err => {
        console.log('=> an error occurred: ', err);
        return { statusCode: 500, body: 'error' };
      });
  }
  const time2 = Date.now();

  return { statusCode: 200, body: (time2-time).toString() };
}

module.exports.read = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('event: ', event);

  connectToDatabase(MONGODB_URI)
    .then(db => queryDatabase(db))
    .then(result => {
      console.log('=> returning result: ', result);
      callback(null, result);
    })
    .catch(err => {
      console.log('=> an error occurred: ', err);
      callback(err);
    });
};