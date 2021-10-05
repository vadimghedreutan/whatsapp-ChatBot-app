import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBPNngPBvXqP9q68C27nJW0_bNME8ctBdE',
  authDomain: 'whatsapp-clone-13173.firebaseapp.com',
  projectId: 'whatsapp-clone-13173',
  storageBucket: 'whatsapp-clone-13173.appspot.com',
  messagingSenderId: '733777856021',
  appId: '1:733777856021:web:b3a33a99d9190eb680301c',
}

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { db, auth, provider }
