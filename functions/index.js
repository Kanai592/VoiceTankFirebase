

// const serviceAccount = require("/Users/rk/Development/VoiceTankFirebase/functions/index.js:5:1");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://voice-tank-app.firebaseio.com"
// });





//firebase functionsのモジュールインポート
const functions = require('firebase-functions');
//firebase admin sdkのモジュールインポート
const admin = require('firebase-admin');
//インスタンスの初期化
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

//expressモジュールのインポート
const express = require('express');
const app = express();
const router = express.Router();
//corsモジュールのインポート
const cors = require('cors')({origin: true});
app.use(cors);





// 1/29(wed)


// router.get('/test', async (req, res, next) => {
//   try {
//     const itemSnapshot = await db.collection('items').get();
//     const items = [];
//     itemSnapshot.forEach(doc => {
//       items.push({
//         id: doc.id,
//         data: doc.data()
//       });
//     });
//     res.json(items);
//   } catch (e) {
//     next(e);
//   }
// });

router.post('/kanai-special', function(req, res, next) {
  var data = req.body
  var docRef = db.collection(data.collection_name)
    .doc(data.doc_name);
  
  docRef.set(data.insert_data).then(ref => {
    res.json({
      'message' : 'success'
    });
  }).catch(e => {
    next(e);
  });
})


// 生徒一覧取得
router.get('/classes/:class_id/students', async (req, res, next) => {
  try {
    const classId = req.params.class_id;

    const snapshot = await db.collection('students')
      .where('class_id', '==', parseInt(classId))
      .get();

    const students = [];
    snapshot.forEach(doc => {
      students.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(students);
  } catch (e) {
    next(e);
  }
});

// 生徒一人分を取得
router.get('/classes/:class_id/students/:student_number', async (req, res, next) => {
  try {
    const classId = req.params.class_id;
    const student_number = req.params.student_number;

    const snapshot = await db.collection('students')
      .where('class_id', '==', parseInt(classId))
      .where('student_number', '==', student_number)
      .get();

    const students = [];
    snapshot.forEach(doc => {
      students.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(students);
  } catch (e) {
    next(e);
  }
});

// 評価に関する取得
router.get('/classes/:class_id/students/:student_number/evaluations', async (req, res, next) => {
  try {
    const classId = req.params.class_id;
    const studentNumber = req.params.student_number;

    const snapshot = await db.collection('evaluations')
      .where('student_number', '==', studentNumber)
      .get();

    const evaluations = [];
    snapshot.forEach(doc => {
      evaluations.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(evaluations);
  } catch (e) {
    next(e);
  }
});

// 成績を保存
router.post('/classes/:class_id/students/:student_number', async (req, res, next) => {
  try {
    const classId = req.params.class_id;
    const studentNumber = req.params.student_number;
    const pointText = req.body.point;

    const docRef = db.collection('evaluations')
      .doc(studentNumber);
  
    const data = {
      point: pointText,
      student_number: studentNumber
    };
    
    docRef.set(data).then(ref => {
      res.json({
        message : 'success'
        
      });
    }).catch(e => {
      next(e);
    });
    
  } catch (e) {
    next(e);
  }
});






// Error Handling
router.use((req, res, next) => {
  res.status(404).json({
    error: 'Route Not Found'
  });
});

router.use((e, req, res, next) => {
  res.status(500).json({
    error: e.name + ': ' + e.message
  });
});

app.use(router);

exports.v1 = functions.https.onRequest(app);