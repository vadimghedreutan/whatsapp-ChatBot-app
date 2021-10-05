import styles from './Loading.module.scss'
import { IoLogoWhatsapp } from 'react-icons/io5'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

function Loading() {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <IoLogoWhatsapp />
          Whatsapp clone web
        </div>
      </div>

      <div className={styles.content}>
        <Loader
          type="Circles"
          color="#3CBC28"
          height={80}
          width={80}
          timeout={3000} //3 secs
        />
      </div>
    </div>
  )
}

export default Loading
