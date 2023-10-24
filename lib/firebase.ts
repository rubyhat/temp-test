import firebase, { User } from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import firebaseConfig from '../firebase.config.json';

// Bug with Hot Reloading.
// Prevent: Firebase App named '[DEFAULT]' already exists (app/duplicate-app)
// https://github.com/zeit/next.js/issues/1999
const baseFirebase = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig, 'Morda')
    : firebase.app('Morda');

export const storage = baseFirebase.storage();

export const currentUser: () => Promise<User | null> = () => {
    return new Promise(resolve => {
        baseFirebase.auth().onAuthStateChanged(resolve);
    });
};

export default baseFirebase;
