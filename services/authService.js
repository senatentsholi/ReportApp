import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { firebaseAuth, firestore } from '../firebase/config';

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

function normalizeUser(uid, profile = {}) {
  return {
    id: uid,
    uid,
    name: profile.name || profile.fullName || '',
    fullName: profile.name || profile.fullName || '',
    email: profile.email || '',
    role: normalizeRole(profile.role),
    className: profile.className || '',
    facultyName: profile.facultyName || '',
    department: profile.facultyName || profile.department || '',
    avatarUrl: profile.avatarUrl || '',
  };
}

async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(firestore, 'users', uid));

  if (!snapshot.exists()) {
    throw new Error('User profile was not found in Firestore.');
  }

  return normalizeUser(uid, snapshot.data());
}

export const authService = {
  subscribeToAuthChanges(callback) {
    return onAuthStateChanged(firebaseAuth, async (sessionUser) => {
      if (!sessionUser) {
        callback(null);
        return;
      }

      try {
        const profile = await getUserProfile(sessionUser.uid);
        callback(profile);
      } catch (error) {
        callback(null, error);
      }
    });
  },

  async signIn({ email, password, role }) {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    const profile = await getUserProfile(credential.user.uid);

    if (profile.role !== normalizeRole(role)) {
      await signOut(firebaseAuth);
      throw new Error('Selected role does not match the registered account role.');
    }

    return profile;
  },

  async register({ fullName, email, password, role }) {
    const normalizedRole = normalizeRole(role);
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim().toLowerCase(), password);

    const profile = {
      uid: credential.user.uid,
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: normalizedRole,
      createdAt: serverTimestamp(),
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
