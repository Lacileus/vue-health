import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA69WkdIKsu_umItaQIziPkAhz3gwH3YKk',
  authDomain: 'vue-health-4fe39.firebaseapp.com',
  projectId: 'vue-health-4fe39',
  storageBucket: 'vue-health-4fe39.appspot.com',
  messagingSenderId: '338557600982',
  appId: '1:338557600982:web:705b32894f67aecf8c7577'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export { db, storage, auth }
