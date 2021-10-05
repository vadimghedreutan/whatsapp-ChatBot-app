import { useState } from 'react'
import Image from 'next/image'
import {
  IoLogoWechat,
  IoSearchOutline,
  IoChatboxEllipsesOutline,
} from 'react-icons/io5'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { FaUserCircle } from 'react-icons/fa'
import * as EmailValidator from 'email-validator'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from '../Chat'

import styles from './Sidebar.module.scss'
import { auth, db } from '../../../firebase'

function Sidebar() {
  const [user] = useAuthState(auth)
  const userChatRef = db
    .collection('chats')
    .where('users', 'array-contains', user.email)
  const [chatsSnapshot] = useCollection(userChatRef)

  const [isOpen, setIsOpen] = useState(false)
  const createChat = () => {
    const input = prompt(
      'Please enter an email address for the user wish to chat with'
    )
    if (!input) return

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.email
    ) {
      // chat into db  'chat' collections
      db.collection('chats').add({
        users: [user.email, input],
      })
    }
  }

  const chatAlreadyExist = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )

  const handleTaggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <IoLogoWechat />
          <h1>ChatBot</h1>
        </div>
        <div className={styles.user}>
          <Image
            src={user.photoURL}
            width={40}
            height={40}
            className={styles.image}
          />
          <span onClick={handleTaggle}>
            <HiOutlineDotsVertical />
          </span>
        </div>
      </div>

      <div className={styles.search}>
        <IoSearchOutline />
        <input type="text" placeholder="Search..." />
      </div>

      <button className={styles.btn} onClick={createChat}>
        <IoChatboxEllipsesOutline />
        <p>New Chat</p>
      </button>

      {/* List of Chats */}
      {chatsSnapshot?.docs.map((chat) => {
        return <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      })}

      {isOpen && (
        <div className={styles.model}>
          <ul>
            <li onClick={() => auth.signOut()}>Sign Out</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Sidebar
