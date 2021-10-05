import { useEffect } from 'react'
import '../styles/globals.scss'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db, auth } from '../../firebase'
import Login from './login'
import Loading from '../components/Loading.js'
import firebase from 'firebase/compat/app'

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { marge: true }
      )
    }
  }, [user])

  if (loading) return <Loading />
  if (!user) return <Login />
  return <Component {...pageProps} />
}

export default MyApp
