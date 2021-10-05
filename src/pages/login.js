import Head from 'next/head'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { auth, provider } from '../../firebase'

import styles from '../styles/Signin.module.scss'

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(function (error) {
      console.log('Sign in faild', error)
    })
  }

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <IoLogoWhatsapp />
            Whatsapp clone web
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.login}>
            <h2>Sign with Google</h2>
            <button className={styles.btn} onClick={signIn}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
