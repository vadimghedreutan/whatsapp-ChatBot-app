import styles from './Chat.module.scss'
import Image from 'next/image'
import getRecipientEmail from '../../utils/getRecipientEmail'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'

function Chat({ id, users }) {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [recipientSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientEmail(users, user))
  )

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const recipientEmail = getRecipientEmail(users, user)

  return (
    <div className={styles.container}>
      <div className={styles.flex} onClick={enterChat}>
        <div className={styles.user}>
          {recipient ? (
            <Image
              src={recipient?.photoURL}
              width={40}
              height={40}
              className={styles.image}
            />
          ) : (
            <div className={styles.recipient}>
              <span>{recipientEmail[0]}</span>
            </div>
          )}
        </div>
        <div className={styles.email}>
          <p>{recipientEmail}</p>
        </div>
      </div>
    </div>
  )
}

export default Chat
