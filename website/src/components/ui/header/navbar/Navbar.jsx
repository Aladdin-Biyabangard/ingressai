import React from "react";

import NavbarLogo from "./navbar-logo/NavbarLogo";
import NavbarItems from "./navbar-items/NavbarItems";
import Apply from "./apply/Apply";
import HamburgerMenu from "./hamburger-menu/HamburgerMenu";
import ContactPhone from "@/components/shared/contact-phone/ContactPhone";

import styles from "./navbar.module.css";

const Navbar = ({ organization }) => {
  return (
    <nav className={styles.navbar}>
      <NavbarLogo />
      <div className={styles.navbarRightContainer}>
        <div className={styles.navbarDesktop}>
          <NavbarItems />
          <Apply />
        </div>
        <div className={styles.navbarMobile}>
          <ContactPhone phone={organization?.phoneNumbers?.[0]} />
          <HamburgerMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
