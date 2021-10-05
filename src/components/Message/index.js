import styles from './Message.module.scss'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase'
import moment from 'moment'

function Message({ user, message }) {
  const [userLoggenIn] = useAuthState(auth)

  return (
    <div className={styles.container}>
      <div className={styles.msg_element}>
        {user === userLoggenIn.email ? (
          <p className={styles.reciever}>
            {message.message}
            <span>
              {message.timestamp
                ? moment(message.timestamp).format('LT')
                : '...'}
            </span>
          </p>
        ) : (
          <p className={styles.sender}>
            {message.message}
            <span>
              {message.timestamp
                ? moment(message.timestamp).format('LT')
                : '...'}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Message
