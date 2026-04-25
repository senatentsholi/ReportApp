import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { createEmptyData } from './initialData';

const collectionNames = ['users', 'classes', 'reports', 'courses', 'attendance', 'ratings', 'notifications', 'monitoring'];
const orderedCollections = new Set(['reports', 'notifications', 'monitoring']);

function withDocumentId(snapshot) {
  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      ...data,
      uid: data.uid || item.id,
      name: data.name || data.fullName || '',
      fullName: data.name || data.fullName || '',
      role: data.role || '',
    };
  });
}

function buildCollectionRef(name) {
  return orderedCollections.has(name)
    ? query(collection(firestore, name), orderBy('createdAt', 'desc'))
    : collection(firestore, name);
}

async function addRecord(name, payload, includeTimestamp = false) {
  const response = await addDoc(collection(firestore, name), {
    ...payload,
    ...(includeTimestamp ? { createdAt: serverTimestamp() } : {}),
  });

  return { id: response.id, ...payload };
}

async function updateRecord(name, recordId, payload) {
  await updateDoc(doc(firestore, name, recordId), payload);
  return payload;
}

async function deleteRecord(name, recordId) {
  await deleteDoc(doc(firestore, name, recordId));
  return true;
}

export const appDataService = {
  subscribeAll({ onData, onError }) {
    const state = createEmptyData();

    const unsubscribers = collectionNames.map((name) =>
      onSnapshot(
        buildCollectionRef(name),
        (snapshot) => {
          state[name] = withDocumentId(snapshot);

          onData({
            data: {
              ...createEmptyData(),
              ...state,
            },
          });
        },
        onError
      )
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  },

  createReport(payload) {
    return addRecord('reports', payload, true);
  },

  getReports({ onData, onError }) {
    return onSnapshot(
      query(collection(firestore, 'reports'), orderBy('createdAt', 'desc')),
      (snapshot) => onData(withDocumentId(snapshot)),
      onError
    );
  },

  updateReport(reportId, payload) {
    return updateRecord('reports', reportId, payload);
  },

  deleteReport(reportId) {
    return deleteRecord('reports', reportId);
  },

  addAttendance(payload) {
    return addRecord('attendance', payload, true);
  },

  updateAttendance(attendanceId, payload) {
    return updateRecord('attendance', attendanceId, payload);
  },

  deleteAttendance(attendanceId) {
    return deleteRecord('attendance', attendanceId);
  },

  addRating(payload) {
    return addRecord('ratings', payload, true);
  },

  updateRating(ratingId, payload) {
    return updateRecord('ratings', ratingId, payload);
  },

  deleteRating(ratingId) {
    return deleteRecord('ratings', ratingId);
  },

  addCourse(payload) {
    return addRecord('courses', payload);
  },

  updateCourse(courseId, payload) {
    return updateRecord('courses', courseId, payload);
  },

  deleteCourse(courseId) {
    return deleteRecord('courses', courseId);
  },

  addClass(payload) {
    return addRecord('classes', payload, true);
  },

  updateClass(classId, payload) {
    return updateRecord('classes', classId, payload);
  },

  deleteClass(classId) {
    return deleteRecord('classes', classId);
  },

  addMonitoring(payload) {
    return addRecord('monitoring', payload, true);
  },

  updateMonitoring(monitoringId, payload) {
    return updateRecord('monitoring', monitoringId, payload);
  },

  deleteMonitoring(monitoringId) {
    return deleteRecord('monitoring', monitoringId);
  },

  updateProfile(userId, payload) {
    return updateRecord('users', userId, payload);
  },

  async markNotificationRead(notificationId) {
    await updateRecord('notifications', notificationId, { read: true });
    return true;
  },
};
