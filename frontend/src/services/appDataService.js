import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { createEmptyData } from './initialData';

const collectionNames = [
  'users',
  'classes',
  'reports',
  'courses',
  'attendance',
  'ratings',
  'notifications',
  'monitoring',
  'feedback',
];
function withDocumentId(snapshot) {
  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      ...data,
      uid: data.uid || item.id,
      name: data.name || data.fullName || '',
      fullName: data.fullName || data.name || '',
      studentNumber: data.studentNumber || '',
      role: data.role || '',
    };
  });
}

function buildCollectionRef(name) {
  return collection(firestore, name);
}

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

function buildScopedSource(name, user) {
  const role = normalizeRole(user?.role);
  const uid = user?.uid || '';
  const ref = buildCollectionRef(name);

  if (!user) {
    return null;
  }

  switch (name) {
    case 'users':
      return ref;
    case 'notifications':
      return query(ref, where('userId', '==', uid));
    case 'feedback':
      return role === 'pl' || role === 'prl' ? ref : null;
    case 'courses':
      return ref;
    case 'classes':
      return ref;
    case 'reports':
      return ref;
    case 'attendance':
      return ref;
    case 'ratings':
      return ref;
    case 'monitoring':
      return ref;
    default:
      return ref;
  }
}

async function addRecord(name, payload, includeTimestamp = false) {
  const response = await addDoc(collection(firestore, name), {
    ...payload,
    ...(includeTimestamp ? { createdAt: serverTimestamp(), updatedAt: serverTimestamp() } : {}),
  });

  return { id: response.id, ...payload };
}

async function updateRecord(name, recordId, payload) {
  await updateDoc(doc(firestore, name, recordId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
  return payload;
}

async function deleteRecord(name, recordId) {
  await deleteDoc(doc(firestore, name, recordId));
  return true;
}

async function fetchCollection(name, user) {
  const source = buildScopedSource(name, user);

  if (!source) {
    return [];
  }

  const snapshot = await getDocs(source);
  return withDocumentId(snapshot);
}

export const appDataService = {
  async fetchAll(user) {
    const entries = await Promise.all(
      collectionNames.map(async (name) => [name, await fetchCollection(name, user)])
    );
    return entries.reduce(
      (accumulator, [name, records]) => ({
        ...accumulator,
        [name]: records,
      }),
      createEmptyData()
    );
  },

  subscribeAll(user, { onData, onError }) {
    const state = createEmptyData();

    const unsubscribers = collectionNames
      .map((name) => {
        const source = buildScopedSource(name, user);

        if (!source) {
          state[name] = [];
          return null;
        }

        return onSnapshot(
          source,
          (snapshot) => {
            state[name] = withDocumentId(snapshot);

            onData({
              data: {
                ...createEmptyData(),
                ...state,
              },
            });
          },
          (error) => {
            onError?.({ collection: name, error });
          }
        );
      })
      .filter(Boolean);

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  },

  createReport(payload) {
    return addRecord('reports', payload, true);
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
    return addRecord('courses', payload, true);
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

  addFeedback(payload) {
    return addRecord('feedback', payload, true);
  },

  updateFeedback(feedbackId, payload) {
    return updateRecord('feedback', feedbackId, payload);
  },

  deleteFeedback(feedbackId) {
    return deleteRecord('feedback', feedbackId);
  },

  updateProfile(userId, payload) {
    return updateRecord('users', userId, payload);
  },

  async markNotificationRead(notificationId) {
    await updateRecord('notifications', notificationId, { read: true });
    return true;
  },
};

