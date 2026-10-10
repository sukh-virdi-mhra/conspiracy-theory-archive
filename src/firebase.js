import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore'

const app = initializeApp({
  apiKey: "AIzaSyCihTe_C838qPhUXUNGlpK5Xr-4j980osQ",
  authDomain: "conspiracy-theory-archive.firebaseapp.com",
  projectId: "conspiracy-theory-archive",
  storageBucket: "conspiracy-theory-archive.firebasestorage.app",
  messagingSenderId: "1010465511116",
  appId: "1:1010465511116:web:d6034d395c1c7149a4d469",
})

const db = getFirestore(app)
const theoriesRef = collection(db, 'theories')

export function subscribeTheories(callback) {
  const q = query(theoriesRef, orderBy('dateAdded', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({ firebaseId: d.id, ...d.data() }))
    callback(list)
  })
}

export async function addTheoryToDb(theory) {
  await addDoc(theoriesRef, theory)
}

export async function deleteTheoryFromDb(firebaseId) {
  await deleteDoc(doc(db, 'theories', firebaseId))
}

export async function seedDefaults(defaults) {
  const snapshot = await getDocs(theoriesRef)
  if (snapshot.empty) {
    for (const t of defaults) {
      await addDoc(theoriesRef, t)
    }
  }
}
