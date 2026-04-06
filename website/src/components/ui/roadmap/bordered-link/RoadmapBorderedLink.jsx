import LocaleLink from '@/components/shared/locale-link/LocaleLink'
import Image from 'next/image'

import styles from './roadmap-bordered-link.module.css'


const RoadmapBorderedLink = ({text,url}) => {
  return (
       <LocaleLink
          className={styles.link}
          href={url}
        >
          <div className={styles.text}>{text}</div>
          <div className={styles.iconContainer}>
            <Image
              src="/icons/arrow-top-right.svg"
              height={20}
              width={20}
              alt="Arrow"
              className={styles.icon}
            />
            <Image
              src="/icons/arrow-dark.svg"
              height={20}
              width={20}
              alt="Arrow Hover"
              className={styles.iconHover}
            />
          </div>
        </LocaleLink>
  )
}

export default RoadmapBorderedLink