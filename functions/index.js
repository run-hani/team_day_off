const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//  exports.testListVaca = functions.database.ref('/list_useVacation').onUpdate(event => {
//
//    console.log(event.data.data())
//
//   // const day = event.data.val();
//   // const roomRef = event.data.ref.parent.child('userId');
//   // return roomRef.once("value").then(function(snapshot) {
//   //   const room = snapshot.val();
//   //
//   //   console.log(`Day: ${day}, Room: ${room}`)
//   //
//   //   return event.data.ref.parent.child("userId").set(`${day}_${room}`)
//   // });
// });

// .onWrite((event) => {
//   const user = event.data.val();
//   console.log('[saveUser] - user: ', event.params.userId, user);
//
//   //console.log(event)
//   //console.log(event.params.pushId);
//
//   //const newValue = event.data.ref;
//   //const collectionRef = newValue.child('userId');
//   // const userId = newValue.userId;
//   // //console.log(original)
//   // console.log(userId)
//   //
//   //return admin.database().ref(`/list_calc_vacation/${collectionRef}/2018/1`).push({countUseDay:100})
//   return null;
// })

exports.testListVaca = functions.database.ref('/list_useVacation/{pushId}/userId')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing',original);
    //const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.

    //return snapshot.ref.parent.child('uppercase').set(uppercase);
    return null;
});
