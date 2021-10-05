import { useState, useRef } from 'react'
import Image from 'next/image'
import styles from './ChatScreen.module.scss'
import { auth, db } from '../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { CgAttachment } from 'react-icons/cg'
import { BsThreeDotsVertical, BsFillMicFill } from 'react-icons/bs'
import { BiSmile } from 'react-icons/bi'
import { IoIosArrowBack } from 'react-icons/io'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from '../Message'
import firebase from 'firebase/compat/app'
import getRecipientEmail from '../../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth)
  const [input, setInput] = useState('')
  const endOfMessageRef = useRef(null)
  const router = useRouter()

  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  )

  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientEmail(chat.users, user))
  )

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ))
    }
  }

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const sendMessage = (e) => {
    e.preventDefault()

    db.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })

    setInput('')
    scrollToBottom()
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const recipientEmail = getRecipientEmail(chat.users, user)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.back} onClick={() => router.push('/')}>
          <IoIosArrowBack />
        </div>
        <div className={styles.user_box}>
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
            <p className={styles.email}>{recipientEmail}</p>
          </div>
          {recipientSnapshot ? (
            <p className={styles.date}>
              Last active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                'Unavailable'
              )}
            </p>
          ) : (
            <p>Loading Last active...</p>
          )}
        </div>
        <div className={styles.info}></div>
        <div className={styles.icons}>
          <div>
            <CgAttachment />
          </div>
          <div>
            <BsThreeDotsVertical />
          </div>
        </div>
      </div>

      <div className={styles.messages_container}>
        {showMessages()}
        <div className={styles.end} ref={endOfMessageRef}></div>
      </div>

      <div className={styles.input_container}>
        <div className={styles.emoji}>
          <BiSmile />
        </div>
        <form className={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send Message
          </button>
        </form>
        <div className={styles.icons}>
          <div>
            <BsFillMicFill />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen
