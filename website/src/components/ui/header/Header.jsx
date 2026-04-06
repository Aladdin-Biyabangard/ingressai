'use client'
import { useGlobalData } from '@/contexts/GlobalDataContext'

import Navbar from './navbar/Navbar'
import ContactInfo from './contact-info/ContactInfo'

import styles from './header.module.css'

const Header = () => {
  const {data} = useGlobalData()

  return (
    <header className={styles.header}>
        <div className={styles.headerContainer}>
        <ContactInfo organization={data.organization}/>
        <div className={`${styles.firstDivider}`}/>
        <Navbar organization={data.organization}/>
        <div className={styles.secondDivider}/>
        </div>
    </header>
  )
}

export default Header