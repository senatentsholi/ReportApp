const { db, admin } = require('../firebase/admin');

async function createRecord(collectionName, payload) {
  const record = {
    ...payload,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const reference = await db.collection(collectionName).add(record);
  return { id: reference.id, ...payload };
}

async function updateRecord(collectionName, id, payload) {
  await db.collection(collectionName).doc(id).set(
    {
      ...payload,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { id, ...payload };
}

async function deleteRecord(collectionName, id) {
  await db.collection(collectionName).doc(id).delete();
  return true;
}

async function getRecord(collectionName, id) {
  const snapshot = await db.collection(collectionName).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

async function listRecords(collectionName, orderField = 'createdAt', direction = 'desc') {
  const snapshot = await db.collection(collectionName).orderBy(orderField, direction).get();
  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

module.exports = {
  createRecord,
  updateRecord,
  deleteRecord,
  getRecord,
  listRecords,
};
