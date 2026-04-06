import React from "react";

import NavbarItem from "./navbar-item/NavbarItem";

import { navbarItems } from "@/lib/constants/navbar";

import styles from "./navbar-items.module.css";

const NavbarItems = ({onClick}) => {
  return (
    <div className={styles.navbarItems}>
      {navbarItems.map((item, index) => (
        <NavbarItem
          key={item.key}
          item={item}
          isLast={index === navbarItems.length - 1}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default NavbarItems;
