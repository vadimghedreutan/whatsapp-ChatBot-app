import { async } from '@firebase/util'
import Head from 'next/head'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import styles from '../../styles/Chat.module.scss'
import { auth, db } from '../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../utils/getRecipientEmail'

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth)

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <div className={styles.chat_sidebar}>
        <Sidebar />
      </div>

      <div className={styles.chat_container}>
        <ChatScreen chat={chat} messages={messages} />
      </div>
    </div>
  )
}

export default Chat

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id)

  // Prep the messages on the server
  const messagesRef = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get()

  const messages = messagesRef.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }))

  // Prep the chats
  const chatRes = await ref.get()
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  }

  // console.log(chat, messages)

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  }
}
