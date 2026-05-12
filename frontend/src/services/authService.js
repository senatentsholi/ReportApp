import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { firebaseAuth, firestore } from '../firebase/config';
import { validateRegistration } from '../utils/validation';

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function buildProfileShape({ uid, email, fullName, role, profile = {} }) {
  const normalizedRole = normalizeRole(profile.role || role);

  return {
    uid,
    name: profile.name || profile.fullName || fullName || '',
    fullName: profile.fullName || profile.name || fullName || '',
    email: (profile.email || email || '').trim().toLowerCase(),
    role: normalizedRole,
    avatarUrl: profile.avatarUrl || '',
    facultyName: profile.facultyName || '',
    className: profile.className || '',
    studentNumber: profile.studentNumber || '',
    department: profile.department || '',
    streamName: profile.streamName || '',
    darkMode: Boolean(profile.darkMode),
  };
}

async function syncProfileDocument({ uid, email, fullName, role }) {
  const profileRef = doc(firestore, 'users', uid);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    throw new Error('Your account details could not be found.');
  }

  const profile = snapshot.data();
  const normalizedRole = normalizeRole(profile.role || role);

  if (!normalizedRole) {
    throw new Error('Your account role is missing.');
  }

  const patch = {};

  if (profile.uid !== uid) {
    patch.uid = uid;
  }

  if (isBlank(profile.name) && !isBlank(fullName)) {
    patch.name = fullName.trim();
  }

  if (isBlank(profile.fullName) && !isBlank(fullName)) {
    patch.fullName = fullName.trim();
  }

  if (isBlank(profile.email) && !isBlank(email)) {
    patch.email = email.trim().toLowerCase();
  }

  if (isBlank(profile.role)) {
    patch.role = normalizedRole;
  }

  ['avatarUrl', 'facultyName', 'className', 'studentNumber', 'department', 'streamName'].forEach((field) => {
    if (profile[field] === undefined) {
      patch[field] = '';
    }
  });

  if (profile.darkMode === undefined) {
    patch.darkMode = false;
  }

  if (!profile.createdAt) {
    patch.createdAt = serverTimestamp();
  }

  if (Object.keys(patch).length) {
    patch.updatedAt = serverTimestamp();
    await setDoc(profileRef, patch, { merge: true });
  }

  return buildProfileShape({
    uid,
    email,
    fullName,
    role: normalizedRole,
    profile: {
      ...profile,
      ...patch,
    },
  });
}

function normalizeUser(uid, profile = {}) {
  return {
    id: uid,
    uid,
    name: profile.name || profile.fullName || '',
    fullName: profile.fullName || profile.name || '',
    email: profile.email || '',
    role: normalizeRole(profile.role),
    className: profile.className || '',
    studentNumber: profile.studentNumber || '',
    facultyName: profile.facultyName || '',
    department: profile.department || '',
    streamName: profile.streamName || '',
    avatarUrl: profile.avatarUrl || '',
    darkMode: Boolean(profile.darkMode),
  };
}

async function getUserProfile(sessionUser, role) {
  const profile = await syncProfileDocument({
    uid: sessionUser.uid,
    email: sessionUser.email || '',
    fullName: sessionUser.displayName || '',
    role,
  });

  return normalizeUser(sessionUser.uid, profile);
}

export const authService = {
  subscribeToAuthChanges(callback) {
    return onAuthStateChanged(firebaseAuth, async (sessionUser) => {
      if (!sessionUser) {
        callback(null);
        return;
      }

      try {
        const profile = await getUserProfile(sessionUser);
        callback(profile);
      } catch (error) {
        callback(null, error);
      }
    });
  },

  async signIn({ email, password, role }) {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    const profile = await getUserProfile(credential.user, role);

    if (profile.role !== normalizeRole(role)) {
      await signOut(firebaseAuth);
      throw new Error('Selected role does not match the registered account role.');
    }

    return profile;
  },

  async register(payload) {
    validateRegistration(payload);
    const normalizedRole = normalizeRole(payload.role);
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      payload.email.trim().toLowerCase(),
      payload.password
    );

    const profile = {
      ...buildProfileShape({
        uid: credential.user.uid,
        email: payload.email,
        fullName: payload.fullName,
        role: normalizedRole,
        profile: {
          facultyName: payload.facultyName || '',
          department: payload.department || '',
          streamName: payload.streamName || '',
          className: payload.className || '',
          studentNumber: payload.studentNumber || '',
        },
      }),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(firestore, 'users', credential.user.uid), profile);

    return normalizeUser(credential.user.uid, profile);
  },

  async signOut() {
    await signOut(firebaseAuth);
  },

  async pickProfileImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      throw new Error('Photo library permission is required to update the profile picture.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets?.[0]?.uri || null;
  },
};

